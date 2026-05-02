---
trigger: always_on
---

# NoticeDecoder Project Rules

## Stack
- Frontend: React 18 + Vite
- Styling: Tailwind CSS only — no inline styles, no CSS modules
- Language translation: Google Translate API (free tier) or i18next
- AI core: Google Gemini API (gemini-1.5-flash model for cost efficiency)
- Backend/Auth: Firebase (Firestore + Firebase Auth + Firebase Hosting)
- State management: React Context API only (no Redux)

## Code Standards
- Every component must be in its own file inside src/components/
- All API calls must be in src/services/ folder
- Use async/await, never raw .then() chains
- Add JSDoc comments to every function
- Never hardcode API keys — always use .env variables prefixed with VITE_
- Always handle loading states and error states in every component
- Mobile-first responsive design — test at 375px width first

## Naming
- Components: PascalCase (e.g. DocumentUpload.jsx)
- Utility files: camelCase (e.g. geminiService.js)
- CSS classes: follow Tailwind utility conventions

## Git
- Commit after every major feature with a clear message
- Never commit .env files