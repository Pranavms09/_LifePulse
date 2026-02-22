# LifePulse - AI-Powered Healthcare Without Barriers

**LifePulse** is a modern healthcare platform designed for rural India. It provides offline-ready AI health assistance, emergency services, and doctor consultations, optimized for low-bandwidth environments.

---

## 📂 Project Structure & File Breakdown

### 🏗️ Directory Overview
```text
LifePulse/
├── api/                # Backend - Serverless Functions (Production)
│   ├── analyze-medicine.js   # Image processing for medicine identification
│   ├── chat.js              # Gemini AI Chat API handler
│   ├── nearby-hospitals.js  # Geo-location logic for hospital search
│   ├── nearby-pharmacies.js # Geo-location logic for pharmacy search
│   └── save-profile.js      # User profile persistence logic
├── public/             # Frontend - Static Assets & UI
│   ├── index.html       # Main Application UI (Single Page Application container)
│   ├── script.js        # Core Frontend Logic (Routing, State, AI interactions)
│   ├── styles.css       # Custom Responsive Design & UI Styling
│   ├── pregnancy.js     # Specialized logic for Pregnancy Companion
│   ├── firebase-auth.js  # Firebase Authentication integration
│   ├── firebase-config.js# Firebase project configuration
│   ├── manifest.json    # PWA Configuration for mobile install
│   ├── service-worker.js# Service Worker for Offline Capabilities
│   └── images/          # Asset storage for UI icons and banners
├── .env.example        # Template for Environment Variables (API Keys)
├── vercel.json         # Vercel Deployment & Routing Configuration
├── package.json        # Node.js Dependencies & NPM Scripts
├── README.md           # Project Documentation (Current File)
└── VERCEL_DEPLOYMENT.md # Deployment Guide
```

---

## 💻 Technical Deep Dive

### 🎨 Frontend Logic (`public/`)

- **`index.html`**: The heartbeat of the application. It uses a section-based architecture (MPA/SPA hybrid) with Tailwind CSS for rapid, responsive UI development.
- **`script.js`**: 
    - **Routing**: Handles section switching via `showSection()` and browser history management.
    - **AI Integration**: Communicates with the `/api/chat` endpoint and processes responses.
    - **Voice Assistant**: Implements bilingual (Hindi/English) voice-to-text and text-to-speech using browser native APIs.
    - **State Management**: Tracks user authentication, online/offline status, and chat history.
- **`pregnancy.js`**: Isolated logic for the Pregnancy Care feature, managing developmental tracking and specialized AI prompts.
- **`service-worker.js`**: Enables Progressive Web App (PWA) features, allowing the app to load and provide basic functionality even without an internet connection.

### ⚙️ Backend API (`api/`)

The project uses **Vercel Serverless Functions** for the backend, ensuring high scalability and zero-server maintenance.
- **Gemini AI Integration (`chat.js`)**: Leverages `@google/generative-ai` to process medical queries with context-aware prompts designed for rural health scenarios.
- **Medicine Analyzer (`analyze-medicine.js`)**: Uses vision-based AI to help users understand their prescriptions or medicine labels via photo upload.
- **Location Services**: `nearby-hospitals.js` and `nearby-pharmacies.js` provide distance-based search for medical facilities using mock or external API data.

---

## 🛠️ Technology Stack

| Component      | Technology |
| :---           | :--- |
| **Frontend**   | HTML5, CSS3, JavaScript (ES6+), Tailwind CSS |
| **AI Engine**  | Google Gemini AI (via API) |
| **Auth**       | Firebase Authentication (Email/Google) |
| **Deployment** | Vercel (Serverless Functions) |
| **PWA**        | Service Workers, Manifest API |
| **Mobile**     | Capacitor.js (Android/iOS builds) |

---

## 🚀 Quick Start

### 1. Local Development
To run the full environment including the AI features:
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to view the app.

### 2. Environment Setup
Create a `.env` file in the root based on `.env.example`:
```env
GEMINI_API_KEY=your_key_here
FIREBASE_API_KEY=your_key_here
```

---

## 🚨 Key Features Explained

1. **🤖 Sanjeevani AI**: 24/7 bilingual healthcare assistant that responds to medical symptoms and queries.
2. **🔊 Voice Assistant**: Native voice recognition and synthesis for hands-free or low-literacy usage.
3. **🚑 SOS Emergency**: One-touch access to ambulance services and top-of-the-list hospital locations.
4. **📦 Medical Store Finder**: Live map and distance tracking for medical supplies.

---

## 📄 License & Team

**Project**: LifePulse - Affordable AI Healthcare for Rural India
**License**: MIT License
**Year**: 2026

*Built for accessibility, powered by AI.*
