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
