const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path');
const { sendEmail } = require('./mailer');
//const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Get time

app.get('/api/time', async (req,res) =>
{
  try {
    const utcNow = new Date();
    const dhakaNow = new Date(utcNow.getTime() + 6 * 60 * 60 * 1000);
    res.json(dhakaNow);
  }
  catch(e)
  {
    console.error(`Error getting time`, e);
  }
})

// Get all exams
app.get('/api/exams', async (req, res) => {
  try {
    // 1. Get current time in Dhaka
    const utcNow = new Date();
    const dhakaNow = new Date(utcNow.getTime() + 6 * 60 * 60 * 1000);


    console.log("Current Dhaka Time:", dhakaNow.toISOString());

    // 2. Get all exams
    const [exams] = await pool.query('SELECT * FROM exams');

    const upcomingExams = [];
    const expiredExams = [];

    for (const exam of exams) {
  try {
    // Construct date string manually to avoid timezone shift
    const examDateStr = `${exam.exam_date.getFullYear()}-${String(exam.exam_date.getMonth() + 1).padStart(2, '0')}-${String(exam.exam_date.getDate()).padStart(2, '0')}`;
    const startTimeStr = exam.start_time; 

    const examStart = new Date(`${examDateStr}T${startTimeStr}Z`); 
    const finishTime = new Date(examStart.getTime() + exam.duration_minutes * 60000);

    console.log(`Exam: ${exam.course_name} | Start: ${examStart} | Finish: ${finishTime}`);

    if (finishTime < dhakaNow) {
      expiredExams.push([exam.course_name, exam.exam_no, exam.batch]);
    } else {
      upcomingExams.push(exam);
    }
  } catch (e) {
    console.error(`Error parsing exam date for ${exam.course_name}:`, e);
  }
}


    // 5. Delete expired exams
    for (const [course_name, exam_no, batch] of expiredExams) {
      console.log(`Deleting past exam: ${course_name}, Exam No: ${exam_no}, Batch: ${batch}`);
      await pool.query(
        'DELETE FROM exams WHERE course_name = ? AND exam_no = ? AND batch = ?',
        [course_name, exam_no, batch]
      );
    }
    res.json(upcomingExams);
  } catch (err) {
    console.error('Error during exam cleanup:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Handle root URL by sending index.html

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Add new exam
app.post('/api/exams', async (req, res) => {
  const { course_name, exam_no, exam_date, start_time, duration_minutes, batch, invigilator_name, invigilator_email } = req.body;
  
  
  if (batch < 47 || batch > 54) {
    return res.status(400).json({ error: 'Batch must be between 47-54' });
  }
  if (invigilator_email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(invigilator_email)) {
    return res.status(400).json({ error: 'Invalid email format for invigilator' });
  }
   // ✅ Email helper functions
  function notifyScheduled(email, course, no, batch, date, time, duration) {
    sendEmail(
      email,
      `Exam Scheduled: ${course}`,
      `You have scheduled an exam.\n\nCourse: ${course}\nExam No: ${no}\nBatch: ${batch}\nDate: ${date}\nStart Time: ${time}\nDuration: ${duration} minutes.`
    );
  }

  function notifyStarted(email, course, no, batch, time, duration) {
    sendEmail(
      email,
      `Exam Started: ${course}`,
      `The ${course} Exam No.${no} of Batch-${batch} is Started at ${time} and Duration is ${duration} minutes.`
    );
  }

  function notifyFinished(email, course, no, batch) {
    sendEmail(
      email,
      `Exam Finished: ${course}`,
      `The ${course} Exam No.${no} of Batch-${batch} is finished.`
    );
  }
  try {
    const query = `
      INSERT INTO exams (course_name, exam_no, exam_date, start_time, duration_minutes, batch, invigilator_name, invigilator_email) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      course_name, 
      exam_no, 
      exam_date, 
      start_time, 
      duration_minutes, 
      batch, 
      invigilator_name || null, // If invigilator_name is not provided, insert null
      invigilator_email || null  // If invigilator_email is not provided, insert null
    ];

    // Execute the query
    const [result] = await pool.query(query, values);

    if (invigilator_email) {
      const [year, month, day] = exam_date.split('-').map(Number);
      const [hour, minute] = start_time.split(':').map(Number);

      const examStartUTC = new Date(Date.UTC(year, month - 1, day, hour - 6, minute));
      const now = new Date();

      const timeUntilStart = examStartUTC - now;
      const timeUntilEnd = timeUntilStart + duration_minutes * 60 * 1000;
      
      // 📧 Notify when scheduled
      notifyScheduled(
        invigilator_email,
        course_name,
        exam_no,
        batch,
        exam_date,
        start_time,
        duration_minutes
      );

      if (timeUntilStart > 0) {
        setTimeout(() => {
          notifyStarted(
            invigilator_email,
            course_name,
            exam_no,
            batch,
            start_time,
            duration_minutes
          );
        }, timeUntilStart);
      } else {
        notifyStarted(
          invigilator_email,
          course_name,
          exam_no,
          batch,
          start_time,
          duration_minutes
        );
      }

      if (timeUntilEnd > 0) {
        setTimeout(() => {
          notifyFinished(invigilator_email, course_name, exam_no, batch);
        }, timeUntilEnd);
      }
    }

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add exam' });
  }
});

// Cancel an exam (DELETE)
app.delete('/api/exams/:course/:examNo/:batch', async (req, res) => {
  const { course, examNo, batch } = req.params;
  
  try {
    const [result] = await pool.query(
      'DELETE FROM exams WHERE course_name = ? AND exam_no = ? AND batch = ?',
      [course, examNo, batch]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel exam' });
  }
});

// Reschedule an exam (PUT - update date/time)
app.put('/api/exams/:course/:examNo/:batch/reschedule', async (req, res) => {
  const { course, examNo, batch } = req.params;
  const { new_date, new_time } = req.body;
  
  try {
    const [result] = await pool.query(
      `UPDATE exams 
       SET exam_date = ?, start_time = ?
       WHERE course_name = ? AND exam_no = ? AND batch = ?`,
      [new_date, new_time, course, examNo, batch]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reschedule exam' });
  }
});

// Update exam duration (PATCH)
app.patch('/api/exams/:course/:examNo/:batch/duration', async (req, res) => {
  const { course, examNo, batch } = req.params;
  const { new_duration } = req.body;
  
  try {
    const [result] = await pool.query(
      `UPDATE exams 
       SET duration_minutes = ?
       WHERE course_name = ? AND exam_no = ? AND batch = ?`,
      [new_duration, course, examNo, batch]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update duration' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Webpage: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/exams`);
});