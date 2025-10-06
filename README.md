# Starlight RAG - Chat with Your Data

This project is a web-based chat application called "Starlight RAG". It provides a user-friendly interface to interact with a Retrieval-Augmented Generation (RAG) assistant, allowing users to chat with their own data. The frontend is fully implemented and connects to a backend API.

## Features

*   **Authenticated Access:** Secure login restricts access to learning tools, with a public-facing chat interface.
*   **Chat Interface:** A clean and modern chat window for interacting with the RAG assistant.
*   **File Management:**
    *   Upload and manage your documents.
    *   A sidebar lists all your uploaded files for easy access.
*   **Learning Tools (Authenticated Users Only):**
    *   **Flashcards:** Review key concepts and information from your documents in a flashcard format.
    *   **Quiz Me:** Test your knowledge with automatically generated quizzes based on your data.
*   **User Feedback:** Provide feedback on the application via a simple modal.
*   **Modern Design:**
    *   A sleek, dark interface with a "glass effect".
    *   Responsive design that works on different screen sizes.

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
3.  **Using the App:**
    *   The application will open in your browser.
    *   If you have an API token, add it to the `API_TOKEN` constant in `script.js` to access authenticated features.
    *   Upload your documents using the "Upload File" button.
    *   Select a file from the sidebar to start chatting with it.
    *   Use the "Flashcards" and "Quiz Me" buttons to review and test your knowledge.

## API Integration

The frontend is fully integrated with the API specification defined in `docs/api_specifications.md`. All data, including files, chat history, flashcards, and quizzes, is designed to be fetched from and managed by the backend.

### Key API Endpoints Used:

*   `GET /files`: Lists all user files.
*   `POST /files`: Uploads new files.
*   `DELETE /files/{fileId}`: Deletes a file.
*   `GET /files/{fileId}/chat`: Retrieves chat history for a file.
*   `POST /files/{fileId}/chat`: Sends a message and gets a response.
*   `POST /files/{fileId}/flashcards`: Generates a new set of flashcards.
*   `POST /files/{fileId}/quizzes`: Generates a new quiz.
*   `POST /feedback`: Submits user feedback.

For detailed request/response schemas, please see the [API Specification document](./docs/api_specifications.md).