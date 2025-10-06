# Starlight RAG - Chat with Your Data

This project is a web-based chat application called "Starlight RAG". It provides a user-friendly interface to interact with a Retrieval-Augmented Generation (RAG) assistant, allowing users to chat with their own data.

## Features

*   **Chat Interface:** A clean and modern chat window for interacting with the RAG assistant.
*   **File Management:**
    *   Upload and manage your documents.
    *   A sidebar lists all your uploaded files for easy access.
*   **Learning Tools:**
    *   **Flashcards:** Review key concepts and information from your documents in a flashcard format.
    *   **Quiz Me:** Test your knowledge with automatically generated quizzes based on your data.
*   **Customizable Settings:**
    *   Provide special instructions to the AI to tailor its responses.
    *   View your storage usage.
    *   Manage your uploaded files.
*   **Modern Design:**
    *   A sleek, dark interface with a "glass effect".
    *   Responsive design that works on different screen sizes.

## Technology Stack

*   **Frontend:**
    *   HTML
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   JavaScript
*   **Icons:** [Lucide Icons](https://lucide.dev/)
*   **Fonts:** [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)

## How to Use

1.  Open the `index.html` file in your web browser.
2.  Upload your documents using the "Upload File" button.
3.  Select a file from the sidebar to start chatting with it.
4.  Use the "Flashcards" and "Quiz Me" buttons to review and test your knowledge.
5.  Customize your experience in the settings menu.

## Application Workflow

The application is designed around a central workflow that allows users to interact with their documents in various ways.

1.  **File Upload and Selection:** The user begins by uploading one or more documents. These files are listed in the sidebar. The user can select a file to make it the active document for all interactions.
2.  **Chat Interaction:** With a file selected, the user can ask questions in the chat interface. The application sends the user's message to the backend, which uses a RAG model to generate a response based on the content of the selected document. The chat history is maintained for each file.
3.  **Flashcard Generation:** The user can request to generate flashcards based on the active document. The backend processes the document and creates a set of question-and-answer pairs. The user can then review these flashcards in the UI.
4.  **Quiz Generation:** Similarly, the user can generate a quiz. The backend creates a set of multiple-choice questions based on the document. The user can take the quiz and see their score at the end.
5.  **Settings and Feedback:** The user can customize the AI's behavior with special instructions and manage their uploaded files in the settings modal. They can also provide feedback on their experience.

## API Endpoints and Data Structures

The following API endpoints are required for the full functionality of the application.

### User and File Management

#### `GET /api/files`

*   **Description:** Retrieves the list of files for the current user.
*   **Response Payload:**
    ```json
    [
        {
            "id": 1,
            "name": "Q3_Sales_Report.pdf",
            "icon": "file-pie-chart",
            "color": "text-violet-400"
        },
        {
            "id": 2,
            "name": "Onboarding_Doc.docx",
            "icon": "file-text",
            "color": "text-sky-400"
        }
    ]
    ```

#### `POST /api/files/upload`

*   **Description:** Uploads a new file.
*   **Request:** `multipart/form-data` with the file.
*   **Response Payload:**
    ```json
    {
        "id": 3,
        "name": "new_document.pdf",
        "icon": "file-text",
        "color": "text-green-400"
    }
    ```

#### `DELETE /api/files/{file_id}`

*   **Description:** Deletes a specific file.
*   **Response:** `204 No Content`

### Chat

#### `GET /api/files/{file_id}/chat`

*   **Description:** Retrieves the chat history for a specific file.
*   **Response Payload:**
    ```json
    [
        { "sender": "bot", "message": "Hello! How can I help you with this document?" },
        { "sender": "user", "message": "What is the main topic?" }
    ]
    ```

#### `POST /api/files/{file_id}/chat`

*   **Description:** Sends a user message and gets a RAG response.
*   **Request Payload:**
    ```json
    {
        "message": "What was the total revenue?"
    }
    ```
*   **Response Payload:**
    ```json
    {
        "response": "The total revenue for Q3 was $1.2M."
    }
    ```

### Learning Tools

#### `POST /api/files/{file_id}/flashcards`

*   **Description:** Generates a set of flashcards from the document.
*   **Request Payload:**
    ```json
    {
        "count": 10
    }
    ```
*   **Response Payload:**
    ```json
    [
        { "q": "What is RAG?", "a": "Retrieval-Augmented Generation." },
        { "q": "What is the capital of France?", "a": "Paris." }
    ]
    ```

#### `POST /api/files/{file_id}/quiz`

*   **Description:** Generates a quiz from the document.
*   **Request Payload:**
    ```json
    {
        "count": 5
    }
    ```
*   **Response Payload:**
    ```json
    [
        {
            "q": "What does CSS stand for?",
            "options": ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"],
            "answer": "Cascading Style Sheets"
        }
    ]
    ```

### Settings and Feedback

#### `POST /api/settings`

*   **Description:** Saves user settings, such as special instructions for the AI.
*   **Request Payload:**
    ```json
    {
        "special_instructions": "Explain concepts like I'm 10 years old."
    }
    ```
*   **Response:** `204 No Content`

#### `POST /api/feedback`

*   **Description:** Submits user feedback.
*   **Request Payload:**
    ```json
    {
        "rating": 5,
        "comments": "This is a great application!"
    }
    ```
*   **Response:** `204 No Content`