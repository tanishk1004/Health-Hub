# 🏥 HealthHub — Healthcare Platform

A full-stack responsive healthcare web application with AI symptom checking, doctor discovery, appointment booking, and health record management.

**No database required to run** — works out of the box with in-memory storage.

---

## 🖥️ Live Preview

| Page | Description |
|------|-------------|
| Home | Landing page with features, stats, testimonials |
| Sign Up / Login | JWT-based authentication |
| Dashboard | Health overview, quick actions, recent history |
| Symptom Checker | AI-powered symptom analysis with severity levels |
| Find Doctors | Browse 8 specialists, filter by specialty/availability |
| Appointments | Book in-person, video, or phone consultations |
| Profile | Personal info, health data, emergency contact, password change |

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **In-memory data store** (no MongoDB required to run)
- **JWT** authentication (jsonwebtoken)
- **bcryptjs** password hashing
- **express-validator** input validation
- **express-rate-limit** brute-force protection

### Frontend
- **React 18** + **React Router v6**
- **Tailwind CSS** — fully responsive, dark/light mode
- **Axios** with JWT interceptors
- **React Hot Toast** notifications
- **Vite** build tool

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/healthhub.git
cd healthhub
```

### 2. Setup Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Server starts at **http://localhost:5001**

### 3. Setup Frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
App opens at **http://localhost:5174**

---

## 📁 Project Structure

```
healthhub/
├── server/                     # Express backend
│   ├── controllers/            # Route handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── symptomsController.js
│   │   ├── doctorsController.js
│   │   └── appointmentsController.js
│   ├── db/
│   │   ├── memoryStore.js      # In-memory data store
│   │   └── seedDoctors.js      # Doctor seed data
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── symptoms.js
│   │   ├── doctors.js
│   │   └── appointments.js
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Entry point
│
└── client/                     # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── DoctorCard.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── SymptomChecker.jsx
    │   │   ├── Doctors.jsx
    │   │   ├── Appointments.jsx
    │   │   └── Profile.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/user/profile` | ✅ | Get profile |
| PUT | `/api/user/profile` | ✅ | Update profile |
| PUT | `/api/user/change-password` | ✅ | Change password |
| POST | `/api/symptoms/analyze` | ⚠️ | Analyze symptoms (optional auth) |
| GET | `/api/symptoms/history` | ✅ | Get symptom history |
| DELETE | `/api/symptoms/history/:id` | ✅ | Delete history record |
| GET | `/api/doctors` | ✅ | List doctors (search/filter) |
| GET | `/api/doctors/:id` | ✅ | Get doctor by ID |
| POST | `/api/appointments` | ✅ | Book appointment |
| GET | `/api/appointments` | ✅ | Get my appointments |
| PUT | `/api/appointments/:id/cancel` | ✅ | Cancel appointment |
| GET | `/api/health` | ❌ | Health check |

---

## 💾 Adding MongoDB (Optional)

The app runs fully without MongoDB. To persist data across restarts:

1. Get a free MongoDB Atlas URI at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Update `server/.env`:
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/healthhub
```

---

## ✨ Features

- ✅ Responsive design — mobile, tablet, desktop
- ✅ Dark / Light mode toggle
- ✅ JWT authentication with auto-refresh
- ✅ AI symptom checker (11 condition categories)
- ✅ Severity levels: Low / Moderate / High / Critical
- ✅ Doctor directory with search and filters
- ✅ Appointment booking with time slot selection
- ✅ Duplicate booking prevention
- ✅ Password strength indicator
- ✅ Health profile (blood group, allergies, emergency contact)
- ✅ Rate limiting on auth endpoints
- ✅ Input validation on all forms
- ✅ Graceful error handling throughout

---

## ⚠️ Disclaimer

HealthHub is for informational and educational purposes only. The symptom checker does not provide medical diagnoses. Always consult a qualified healthcare professional for medical advice.

---

## 📄 License

MIT
