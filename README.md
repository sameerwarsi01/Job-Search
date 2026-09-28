# 🎯 Search&Track — AI-Powered Job Search & Application Tracker

A production-ready Full Stack application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js) and Tailwind CSS. **Search&Track** streamlines the job search workflow by combining automated job application tracking, AI resume skill extraction, ATS readiness scoring, and interview pipeline management.

---

## 🌟 Key Features

### 🚀 Frontend & User Interface
- **Interactive Landing Page**: Modern dark-slate & violet glassmorphism theme with ATS readiness gauge preview and feature highlights.
- **Unified Analytics Dashboard**: Real-time KPI stats, application volume charts (via Recharts), upcoming interview notifications, and monthly goal trackers.
- **Multi-Criteria Job Filtering**: Search and filter by role, company name, work arrangement (Remote/Hybrid/Onsite), job type (Full-time/Internship), and posting date.
- **Interactive Application Pipeline**: Direct status management (`Applied`, `Interview`, `Offer`, `Rejected`) with color-coded status badges.
- **Saved Opportunities**: Quick bookmarking system to shortlist target listings.
- **Interview Hub**: Track upcoming technical rounds, scheduled dates, and interview links.
- **Mobile Responsive**: Slide-out drawer navigation and touch-scrollable data tables for handheld screens.

### 🧠 Backend & Core Services
- **AI Resume Parsing**: Upload PDF resumes to extract technical skills and calculate ATS profile calibration scores.
- **Skill-Matched Job Synchronization**: Matches live job openings tailored to the candidate's core tech stack and domain.
- **Modular MVC Architecture**: Clean division across controllers, database configurations, business services, and utility helpers.
- **Security & Authentication**: JSON Web Tokens (JWT) authentication, password hashing with bcryptjs, and protected API routes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React & React Icons (Feather)
- **Data Visualization**: Recharts
- **HTTP Client**: Fetch API / Axios
- **Routing**: React Router DOM v6

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **File Handling**: Multer & PDF-Parse
- **Authentication**: JWT & bcryptjs
- **CORS**: Configured with credentials support

---

## 📂 Project Architecture

```text
Job-Search/
├── BACKEND/
│   ├── Controller/        # Request handlers (jobs, interviews, user, resume)
│   ├── Database/          # MongoDB connection configuration
│   ├── Middleware/        # Authentication & file upload interceptors
│   ├── Models/            # Mongoose schemas (User, Job, Interview)
│   ├── routes/            # REST API endpoint definitions
│   ├── Services/          # Business logic and external API integrations
│   ├── Utils/             # Helper utilities and token handlers
│   ├── app.js             # Express application setup & middleware
│   ├── server.js          # HTTP server listening entry point
│   ├── .env               # Server environment variables (git-ignored)
│   └── package.json
│
├── FRONTEND/
│   ├── public/            # Static media and favicons
│   ├── src/
│   │   ├── assets/        # Images and logos
│   │   ├── components/    # Reusable modular UI components
│   │   ├── pages/         # Views (Dashboard, Jobs, Interviews, Profile, Settings)
│   │   ├── App.jsx        # Route definitions
│   │   └── main.jsx       # Client entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md