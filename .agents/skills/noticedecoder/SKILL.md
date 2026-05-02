# NoticeDecoder Skill

## What this project does
NoticeDecoder is a React web app that lets Indian users paste or upload 
government/legal/bank documents and get a plain-language explanation 
powered by the Gemini API, with multilingual output.

## Key files
- src/services/geminiService.js — handles all Gemini API calls
- src/services/firebaseConfig.js — Firebase initialization
- src/components/DocumentUpload.jsx — file/text input UI
- src/components/ResultPanel.jsx — displays AI explanation
- src/components/LanguageSelector.jsx — language switcher
- src/pages/Home.jsx — main page
- src/pages/History.jsx — past scans (Firestore)

## Gemini Prompt Template
Always use this structure when calling Gemini for document analysis:
"You are a helpful legal document explainer for Indian citizens. 
Analyze the following document and respond ONLY in JSON with these fields:
{ summary, what_it_means, action_required, deadline, urgency_level }"

## Environment Variables needed
VITE_GEMINI_API_KEY
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID