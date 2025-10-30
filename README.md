# Exam Scheduler and Timer System

A professional web-based examination management system designed for educational institutions to schedule, monitor, and notify about exams with real-time countdown functionality.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Exam Scheduler and Timer System provides educational institutions with a comprehensive solution for managing examination schedules. The system features automated notifications, real-time countdown timers, and a responsive web interface suitable for both administrators and invigilators.

## ✨ Features

### 🎛️ Core Management
- **Exam Scheduling**: Create and manage exam schedules with course details, batches, and timings
- **Batch Support**: Dedicated support for student batches 47-54 with validation
- **Real-time Timers**: Live countdown displays for ongoing and upcoming exams
- **Automated Cleanup**: Automatic removal of completed exams from the system

### 🔔 Notification System
- **Email Automation**: Send notifications for exam scheduling, commencement, and completion
- **Browser Alerts**: Real-time desktop notifications
- **Audio Cues**: Sound alerts for critical exam events
- **Multi-channel**: Support for both invigilator and administrator notifications

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach ensuring compatibility across devices
- **Intuitive Interface**: Clean, modern UI with easy navigation
- **Filtering System**: Separate views for ongoing and upcoming examinations
- **Visual Indicators**: Color-coded status displays and progress indicators

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with connection pooling
- **Email Service**: Nodemailer with Gmail SMTP
- **Security**: CORS enabled, input validation, parameterized queries

### Frontend
- **Markup**: HTML5 with semantic structure
- **Styling**: CSS3 with responsive design principles
- **Scripting**: Vanilla JavaScript (ES6+)
- **Audio**: Web Audio API for notifications

## 🚀 Installation

### Prerequisites
- Node.js (v14.0 or higher)
- MySQL Server (v5.7 or higher)
- XAMPP/LAMP/WAMP stack (for local development)

### Step-by-Step Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/arafat21/Exam-Scheduler-and-Timer-System.git
   cd exam-scheduler-timer
Install Dependencies

bash
npm install express mysql2 nodemailer cors
Database Initialization

sql
CREATE DATABASE institute_exams;
USE institute_exams;

CREATE TABLE exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  exam_no INT NOT NULL,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INT NOT NULL,
  batch INT NOT NULL CHECK (batch BETWEEN 47 AND 54),
  invigilator_name VARCHAR(255),
  invigilator_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_batch (batch),
  INDEX idx_date_time (exam_date, start_time)
);
⚙️ Configuration
Database Configuration (db.js)
javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'institute_exams',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
Email Configuration (mailer.js)
javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-specific-password'
  }
});
📡 API Documentation
Endpoints
Method	Endpoint	Description	Parameters
GET	/api/exams	Retrieve all upcoming exams	-
POST	/api/exams	Create new exam schedule	course_name, exam_no, exam_date, start_time, duration_minutes, batch, invigilator_name, invigilator_email
DELETE	/api/exams/:course/:examNo/:batch	Remove exam schedule	URL parameters: course, examNo, batch
PUT	/api/exams/:course/:examNo/:batch/reschedule	Update exam schedule	URL parameters + Body: new_date, new_time
PATCH	/api/exams/:course/:examNo/:batch/duration	Modify exam duration	URL parameters + Body: new_duration
GET	/api/time	Get server time (UTC+6)	-
Request/Response Examples
Create Exam

http
POST /api/exams
Content-Type: application/json

{
  "course_name": "Database Systems",
  "exam_no": 2,
  "exam_date": "2024-12-20",
  "start_time": "10:00",
  "duration_minutes": 180,
  "batch": 50,
  "invigilator_name": "Dr. Smith",
  "invigilator_email": "smith@university.edu"
}
Response

json
{
  "success": true
}
🗃️ Database Schema
Exams Table
Column	Type	Constraints	Description
id	INT	PRIMARY KEY, AUTO_INCREMENT	Unique identifier
course_name	VARCHAR(255)	NOT NULL	Name of the course
exam_no	INT	NOT NULL	Examination number
exam_date	DATE	NOT NULL	Scheduled date
start_time	TIME	NOT NULL	Examination start time
duration_minutes	INT	NOT NULL	Duration in minutes
batch	INT	NOT NULL, CHECK (47-54)	Student batch
invigilator_name	VARCHAR(255)	NULL	Invigilator's name
invigilator_email	VARCHAR(255)	NULL	Invigilator's email
created_at	TIMESTAMP	DEFAULT CURRENT_TIMESTAMP	Record creation timestamp
💻 Usage
Starting the Application
bash
npm start
The application will be available at:

Web Interface: http://localhost:3000

API Base: http://localhost:3000/api

Adding New Exams
Navigate to the web interface

Fill in the exam details form

Set course name, exam number, and batch

Specify date, time, and duration

Optionally add invigilator details

Submit to schedule the exam

Managing Existing Exams
View: All scheduled exams appear with countdown timers

Filter: Toggle between ongoing and upcoming exams

Cancel: Remove exams from the schedule

Reschedule: Modify exam date and time

Update Duration: Change examination duration

🚀 Deployment
Production Considerations
Environment Variables: Replace hardcoded credentials with environment variables

Database: Use production MySQL instance with proper backups

Email Service: Configure professional SMTP service

SSL: Enable HTTPS for secure communications

Process Management: Use PM2 for process management

Environment Setup
bash
# Set environment variables
export DB_USER=production_user
export DB_PASSWORD=secure_password
export DB_NAME=institute_exams
export EMAIL_USER=notifications@yourdomain.edu
export EMAIL_PASSWORD=app_specific_password
🐛 Troubleshooting
Common Issues
Database Connection Failures

Verify MySQL service is running

Check socket path configuration

Confirm database user permissions

Email Delivery Issues

Ensure Gmail account has 2-factor authentication enabled

Generate and use app-specific password

Check SMTP configuration settings

Timezone Discrepancies

System uses Dhaka time (UTC+6)

Verify server timezone settings

Check date/time formatting in requests

