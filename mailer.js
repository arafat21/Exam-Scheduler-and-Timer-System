const nodemailer = require('nodemailer');
//Sender side id and generate pass
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'ashrafulislam9855@gmail.com',       
    pass: 'dpry omdk erdb hqhg'
}
});

async function sendEmail(to, subject, text) {
    const mailOptions = {
    from: 'ashrafulislam9855@gmail.com',
    to,
    subject,
    text,
};

try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} with subject: "${subject}"`);
} catch (error) {
    console.error(`Error sending email to ${to}:`, error);
}
}

module.exports = { sendEmail };
