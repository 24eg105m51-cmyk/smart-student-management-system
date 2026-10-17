# AI Chatbot setup

This project adds an authenticated AI chat widget to the React frontend and a Spring Boot endpoint at `POST /api/ai/chat`. The OpenAI key is used only by the backend and must never be placed in React source code or committed to GitHub.

## Requirements
- Java 21
- MySQL configured for the existing project
- Node.js and npm
- An OpenAI API key with available API quota/billing

## Backend (PowerShell)
From the backend directory (`Backend/student-management-system/student-management-system`), set the environment variables in the same PowerShell window before starting Spring Boot:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = Read-Host "Enter your MySQL password"
$env:JWT_SECRET = Read-Host "Enter your existing JWT secret"
$secureKey = Read-Host "Enter your OpenAI API key" -AsSecureString
$env:OPENAI_API_KEY = [System.Net.NetworkCredential]::new("", $secureKey).Password
Remove-Variable secureKey
.\mvnw.cmd spring-boot:run
```

Use the same `JWT_SECRET` that your existing login system expects. Changing it invalidates existing login tokens; log in again after a change. Do not paste secrets into source files or GitHub. Environment variables set this way last only for that PowerShell session.

## Frontend
Open another PowerShell window, go to `Frontend`, and run:

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal, log in, and use the **Ask AI** button at the bottom-right.

## Error behavior
- `401/403`: log in again and verify JWT/security settings.
- `429`: OpenAI API quota or rate limit; check API usage, billing, and rate limits. A ChatGPT subscription does not automatically provide API credits.
- `503`: `OPENAI_API_KEY` is missing from the backend process environment.
- `502`: the AI provider rejected the key or returned an upstream error.

The `/error` endpoint is permitted so Spring Boot can return the original API error status instead of masking it as a 403. The chatbot endpoint itself remains authenticated.
