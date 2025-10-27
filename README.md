# Starlight RAG - Chat with Your Data

This project is a web-based chat application called "Starlight RAG". It provides a user-friendly interface to interact with a Retrieval-Augmented Generation (RAG) assistant, allowing users to chat with their own data. The frontend is fully implemented and connects to a backend API.

## Current Status: Live and Operational

**The frontend is fully implemented and connected to a live backend API.** All features, including file processing, chat responses, and user authentication, are fully functional.

## Features

*   **Modern & Polished Design:**
    *   A sleek, dark interface with full light mode support.
    *   Responsive design that works on all screen sizes.
    *   Smooth, consistent animations for all interactions, sidebars, and view transitions.
*   **Authenticated Access:** Secure login restricts access to learning tools, with a public-facing chat interface. Includes password confirmation on registration.
*   **Chat Interface:** A clean and modern chat window for interacting with the RAG assistant.
*   **File Management:**
    *   Upload and manage your documents.
    *   A sidebar lists all your uploaded files for easy access.
*   **Learning Tools (Authenticated Users Only):**
    *   **Flashcards:** Review key concepts and information from your documents in a flashcard format.
    *   **Quiz Me:** Test your knowledge with automatically generated quizzes based on your data.

## Technology Stack

*   **Frontend:**
    *   HTML5
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   JavaScript (ES6+)
*   **Backend API:**
    *   The frontend is built to communicate with a RESTful API. The complete specification can be found in [`docs/api_specifications.md`](./docs/api_specifications.md).
*   **Icons:** [Lucide Icons](https://lucide.dev/)
*   **Fonts:** [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)

## How to Use

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/daniel-agblevor/Chat.git
    ```
2.  **Navigate to the frontend directory:**
    ```bash
    cd Chat/frontend
    ```
3.  **Open `index.html` in your browser.** No local server is required as the application communicates with a remote backend.

## API Integration

The frontend is fully integrated with the backend API. The client-side code for making API calls is in `script.js`.

### Key API Endpoints:

*   `https://starlight-ai-129919759539.europe-west1.run.app/api/accounts/register/`
*   `https://starlight-ai-129919759539.europe-west1.run.app/api/accounts/login/`
*   `https://starlight-ai-129919759539.europe-west1.run.app/api/accounts/token/refresh/`
*   `https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/files`
*   `https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/chat/`
*   `https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/settings`
*   `https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/feedback`

For detailed request/response schemas, please see the [API Specification document](./docs/api_specifications.md).