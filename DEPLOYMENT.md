# Deployment Guide for LifePulse

This guide explains how to deploy your AI-powered LifePulse website to Vercel for free 24/7 hosting.

## Prerequisites
1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free).
2.  **GitHub Account**: Required to store your code.
3.  **Gemini API Key**: You already have this in your `.env` file.

## Steps to Deploy

### 1. Push to GitHub
If you haven't already, push your code to a GitHub repository:
1.  Create a new repository on GitHub (e.g., `lifepulse-ai`).
2.  Open your terminal in VS Code.
3.  Run these commands:
    ```bash
    git init
    git add .
    git commit -m "Ready for Vercel deployment"
    git branch -M main
    # Replace proper user/repo URL
    git remote add origin https://github.com/YOUR_USERNAME/lifepulse-ai.git
    git push -u origin main
    ```

### 2. Deploy on Vercel
1.  Go to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `lifepulse-ai` repository.
4.  In the **"Configure Project"** screen:
    - **Framework Preset**: Select **"Other"**.
    - **Root Directory**: Leave as `./`.
    - **Build Command**: Leave empty (or override to `echo 'No build step'`).
    - **Output Directory**: Leave empty.
    - **Environment Variables** (CRITICAL):
        - Click to expand.
        - **Key**: `GEMINI_API_KEY`
        - **Value**: Paste your actual API key (starts with `AIza...`).
        - Click **Add**.
5.  Click **"Deploy"**.

### 3. Verify
- Wait for the deployment to finish (about 1 minute).
- Click the domain provided (e.g., `lifepulse-ai.vercel.app`).
- Test the "AI Assistant" to ensure it replies correctly.

## file structure for Vercel
Ensure your project structure looks like this for optimal deployment:
```
/
├── api/
│   └── chat.js       # Serverless function for AI
├── public/           # Static assets root
│   ├── index.html    # Main entry point
│   ├── script.js     # Frontend logic
│   ├── styles.css    # Styles
│   └── service-worker.js
├── vercel.json       # Vercel configuration
└── package.json      # Dependencies
```

## Troubleshooting
- **AI replies "AI Model not found"?**: This means the API key is missing or invalid in Vercel. Go to **Settings** -> **Environment Variables** on Vercel and check `GEMINI_API_KEY`.
- **404 on API calls?**: The `vercel.json` file handles routing. Ensure it is present in your repository.
- **Build fails?**: Make sure you are not trying to run `npm start` as a build command. The project is a static site with serverless functions.
