# NoticeDecoder

NoticeDecoder is an AI-powered web application designed to simplify complex Indian legal, official, and government documents. By leveraging Google's Gemini API, it breaks down dense legal jargon into plain, understandable English (and other localized languages), extracting critical summaries, deadlines, and actionable insights.

## ✨ Features

*   **AI-Powered Decoding**: Utilizes the Gemini 1.5 Flash model to analyze legal texts (e.g., Cheque Bounce Notices, Property Tax Demands) and generate structured, easy-to-understand summaries.
*   **Actionable Insights**: Automatically extracts and highlights "What This Means," "What You Should Do," and critical deadlines.
*   **Localization Support**: Seamlessly translates the generated legal analysis into various local languages using Google Translate/i18next integrations.
*   **Secure Authentication**: Features Google Sign-In powered by Firebase Authentication.
*   **Cloud History**: Authenticated users can save their decoded notices to their profile, securely stored and retrieved via Firebase Firestore.
*   **Responsive Design**: Built with a mobile-first approach using Tailwind CSS for a polished, modern, and accessible user experience across all devices.

## 🛠 Tech Stack

*   **Frontend**: React 18, Vite
*   **Styling**: Tailwind CSS
*   **AI Core**: Google Gemini API (`gemini-1.5-flash`)
*   **Backend / Auth / Database**: Firebase (Authentication, Firestore, Hosting)
*   **Routing**: React Router DOM
*   **State Management**: React Context API
*   **Document Processing**: `pdfjs-dist`, `mammoth` (for PDF/Word parsing capabilities)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn
*   A Google Gemini API Key
*   A Firebase Project with Authentication (Google Sign-in) and Firestore Database enabled.

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory:
    ```bash
    cd noticedecoder
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root of the project and populate it with your API keys and Firebase configuration:

    ```env
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id

    # Gemini AI Configuration
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```

### Running the Development Server

Start the local Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

*   `src/components/`: Reusable UI components (e.g., HistoryCard).
*   `src/pages/`: Main application views (Home, History, About).
*   `src/services/`: API and third-party integrations (Firebase setup, Gemini service).
*   `src/context/`: React Context providers (AuthContext).

## 📜 Code Standards

*   All components reside in their own files within `src/components/`.
*   API calls and external service logic are abstracted into the `src/services/` folder.
*   Uses `async/await` for asynchronous operations.
*   Strict reliance on Tailwind CSS utility classes; no inline styles or external CSS modules.
*   API keys are strictly managed via environment variables (`VITE_...`).
