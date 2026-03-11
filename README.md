# StartupNest 🚀  
**A Streamlined Startup Incubation & Funding Platform**

StartupNest is a full-stack platform designed to connect ambitious entrepreneurs with industry-leading mentors. It simplifies the process of pitching ideas and managing funding opportunities.

## ✨ Key Features
- **User Roles:** Dedicated dashboards for Entrepreneurs, Mentors, and Admins.
- **Venture Pitching:** Entrepreneurs can submit detailed startup ideas and upload pitch decks (PDF).
- **Mentor Verification:** Admin-controlled verification system for mentor resumes.
- **Portfolio Management:** Mentors can create profiles based on target industries and funding limits.
- **Secure Authentication:** Implemented using JWT (Access & Refresh Tokens) with HTTP-only cookies.

## 🛠 Tech Stack
- **Frontend:** React.js, Framer Motion (Animations), Lucide React (Icons), Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB with Mongoose ODM.
- **File Handling:** Multer for PDF uploads.

## 🚀 How to Run Locally

1. **Clone the project:**
   ```bash
   git clone https://github.com/Deepti-bit/StartupNest.git
   Setup Backend:
Go to nodeapp folder.
Run npm install.
Create a .env file with MONGO_URI and JWT_SECRET.
Start server with npm start.
Setup Frontend:
Go to reactapp folder.
Run npm install.
Start app with npm start.
