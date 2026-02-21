# LifePulse - AI-Powered Healthcare Without Barriers

LifePulse is a comprehensive, production-grade healthcare application designed for rural India. It provides AI-driven medical assistance, emergency response, and health management features. It is built as a Progressive Web App (PWA) with Capacitor support for cross-platform deployment.

## 🚀 Features

### 🤖 AI Health Assistant (Dr. Sanjeevani)
- **Gemini Integration**: Powered by Google Gemini for intelligent, multi-language health consultations.
- **Voice Support**: Continuous multi-language voice input and speech synthesis (English, Hindi, Tamil, Telugu, Bengali, Marathi).
- **Offline Mode**: Support for local Gemma models via Capacitor for AI assistance without internet.

### 💊 Medicine Intelligence
- **Report & Medicine Analyzer**: Upload images of medicine packaging or medical reports for AI-powered analysis.
- **Smart Reminders**: Automated medication schedules with real-time browser/voice notifications.

### 🚨 Emergency & SOS
- **One-Tap SOS**: Instantly alerts emergency contacts via SMS and WhatsApp with the user's live location.
- **Hospital Finder**: Real-time map view of nearby hospitals with contact details and directions.
- **Pharmacy Finder**: Search for nearby medical stores and pharmacies within a customizable radius.

### 📋 Health Management
- **Family Profiles**: Manage health data for multiple family members in a single dashboard.
- **Diet Generator**: Personalized diet plans based on health conditions (e.g., Diabetes, Pregnancy).
- **Health Dashboard**: Visualizations of health trends, vital signs, and medication adherence.

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, Tailwind CSS, HTML5.
- **Maps & Charts**: Leaflet.js (OpenStreetMap), Chart.js.
- **AI Engine**: Google Gemini API (Node.js SDK), Capacitor OfflineAi (Gemma).
- **Backend**: Node.js (Vercel Serverless), Express.
- **Auth & Database**: Firebase Authentication, Google Cloud Firestore.
- **PWA**: Web Manifest, Service Workers.

---

## 📂 Project Structure

```text
LifePulse/
├── api/                        # Vercel Serverless Functions
│   ├── analyze-medicine.js     # AI Vision analysis for medicines
│   ├── chat.js                 # Gemini Pro chat integration
│   ├── nearby-hospitals.js     # Geoapify hospital search
│   ├── nearby-pharmacies.js    # Geoapify pharmacy search
│   └── save-profile.js         # Firestore profile sync
├── public/                     # Frontend Assets
│   ├── firebase-auth.js        # Authentication & Route Guards
│   ├── firebase-config.js      # Firebase Initialization
│   ├── index.html              # Main application markup
│   ├── manifest.json           # PWA configuration
│   ├── script.js               # Core application logic
│   ├── service-worker.js       # PWA Offline Caching
│   └── styles.css              # Custom Animations & Styles
├── capacitor.config.json       # Mobile packaging config
├── package.json                # Dependencies & Scripts
└── vercel.json                 # Vercel Deployment & Rewrites
```
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Firebase Project setup
- Google AI (Gemini) API Key

### Installation
1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`.
4. Run locally: `npm run dev` or `vercel dev`.

---
© 2026 LifePulse Team. All Rights Reserved.
