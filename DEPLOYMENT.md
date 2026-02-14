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
    git commit -m "Initial commit for Vercel deployment"
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
    - **Framework Preset**: Select "Other" (or ensure it detects correctly).
    - **Root Directory**: Leave as `./`.
    - **Environment Variables**:
        - Click to expand.
        - Add `GEMINI_API_KEY` as the name.
        - Paste your actual API key as the value.
5.  Click **"Deploy"**.

### 3. Verify
- Wait for the deployment to finish (about 1 minute).
- Click the domain provided (e.g., `lifepulse-ai.vercel.app`).
- Test the "AI Assistant" to ensure it replies correctly.

## Testing Locally (Optional)
To test the serverless functions locally, you need the Vercel CLI:
1.  Install: `npm i -g vercel`
2.  Run: `vercel dev`
3.  Open `http://localhost:3000`

## Troubleshooting
- **AI not replying?**: Check "Logs" in Vercel dashboard for errors. Ensure your API key is correct in Vercel settings.
- **Redirection issues?**: Fixed in previous updates via relative paths.
