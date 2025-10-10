# Project Documentation: Starlight RAG

## 1. Project Overview

**Project Name:** Starlight RAG
**Description:** A web-based AI assistant that uses Retrieval-Augmented Generation (RAG) to allow users to chat with their documents. The application also provides features to auto-generate flashcards and quizzes from the document content, creating a comprehensive learning and data interaction tool.
Date: October 10, 2025

---

## 2. Core Features

-   **Document Upload & Management:** Users can upload, list, and delete their personal documents.
-   **AI Chat:** Engage in a conversation with an AI that has knowledge of the uploaded documents.
-   **Authenticated Learning Tools:** For logged-in users, the application offers:
    -   **Flashcard Generation:** Automatically create flashcard sets from document content.
    -   **Quiz Generation:** Automatically generate quizzes to test knowledge on the document's subject matter.
-   **User Feedback:** All users can submit feedback on their experience.
-   **Authentication:** The UI dynamically adjusts based on the user's login status, hiding premium features from public view.

---

## 3. Current Progress Summary

As of today, the project's frontend is fully functional and feature-complete.

-   **UI Complete:** The layout, all views (Chat, Flashcards, Quiz), and modals are visually in place and fully interactive.
-   **Client-Side Logic Implemented:** The core application logic in `script.js` is complete. This includes event handling, view switching, and dynamic DOM manipulation.
-   **API Integration:** The frontend is fully connected to the backend API endpoints defined in the `api_specifications.md` document. All data is now fetched and managed via API calls.
-   **Authentication Control:** The UI now correctly shows/hides features based on the user's authentication state.

---

## 4. Detailed Documentation

For more specific details, please refer to the following documents:

-   **[Frontend Development Updates](./frontend_development.md):** A detailed breakdown of the frontend architecture and implementation.
-   **[API Specifications](./api_specifications.md):** The complete guide to the backend API that the frontend consumes.

---

## 5. Next Steps

With the frontend complete, the primary focus shifts to the backend.

1.  **Backend Development:**
    -   Implement the API endpoints as defined in the specifications.
    -   Set up the database and storage solution for user files and data.
    -   Integrate the RAG model and the logic for chat, flashcard, and quiz generation.
2.  **Deployment:**
    -   Deploy the frontend and backend to a hosting environment.
    -   Configure environment variables and security settings.
