# Starlight RAG - Chat with Your Data

This project is a web-based chat application called "Starlight RAG". It provides a user-friendly interface to interact with a Retrieval-Augmented Generation (RAG) assistant, allowing users to chat with their own data. The frontend is fully implemented and connects to a backend API.

## Current Status: Polished Frontend Demonstration

**This is a frontend-only demonstration.** The UI is fully built, interactive, and has been professionally polished. However, it is **not connected to a live backend**. Key functionalities like file processing, chat responses, and user authentication are simulated to showcase the user interface.

## Features

*   **Modern & Polished Design:**
    *   A sleek, dark interface with full light mode support.
    *   Responsive design that works on all screen sizes.
    *   Smooth, consistent animations for all interactions, sidebars, and view transitions.
*   **Authenticated Access:** Secure login restricts access to learning tools, with a public-facing chat interface.
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

Because modern browsers restrict features on pages loaded directly from the local filesystem (`file:///...`), this application requires a local web server to function correctly.

1.  **Prerequisites:** You need a local web server. If you are using VS Code, the **Live Server** extension is a great option.
2.  **Start the Server:** Right-click the `index.html` file and select "Open with Live Server".
3.  **Using the Demo:**
    *   The application will open in your browser.
    *   The login is simulated. Click the login button to see the authenticated UI.
    *   You can simulate uploading documents and interacting with the UI. **Note that no data is being saved or processed.**

## API Integration

The frontend is built to integrate with the API specification defined in `docs/api_specifications.md`. The client-side code for making API calls is in place, but it **requires a functional backend to work**. All data is designed to be fetched from and managed by the backend.

### Key API Endpoints (Pending Backend Implementation):

*   `GET /files`, `POST /files`, `DELETE /files/{fileId}`
*   `GET /files/{fileId}/chat`, `POST /files/{fileId}/chat`
*   `POST /files/{fileId}/flashcards}`, `POST /files/{fileId}/quizzes`
*   `POST /feedback`

For detailed request/response schemas, please see the [API Specification document](./docs/api_specifications.md).