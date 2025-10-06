# Project Documentation: Starlight RAG

## 1. Project Overview

**Project Name:** Starlight RAG
**Description:** A web-based AI assistant that uses Retrieval-Augmented Generation (RAG) to allow users to chat with their documents. The application also provides features to auto-generate flashcards and quizzes from the document content, creating a comprehensive learning and data interaction tool.
**Date:** October 6, 2025

---

## 2. Core Features

-   **Document Upload:** Users can upload files to a personal storage space.
-   **AI Chat:** Engage in a conversation with an AI that has knowledge of the uploaded documents.
-   **Flashcard Generation:** Automatically create flashcard sets from document content for study purposes.
-   **Quiz Generation:** Automatically generate quizzes to test knowledge on the document's subject matter.
-   **User Settings & Feedback:** Users can provide special instructions to the AI and submit feedback.

---

## 3. Current Progress Summary

As of today, the project has a complete frontend user interface. The HTML structure is fully scaffolded, and the application is styled with Tailwind CSS, featuring a modern and responsive design.

-   **UI Complete:** The layout, all views (Chat, Flashcards, Quiz), and modals (Settings, Feedback) are visually in place.
-   **Backend API Defined:** The required API endpoints have been specified but are pending implementation.
-   **Client-Side Logic Pending:** The core application logic in JavaScript, including event handling and API calls, has not yet been implemented.

---

## 4. Detailed Documentation

For more specific details, please refer to the following documents:

-   **[Frontend Development Updates](./frontend_development.md):** A detailed breakdown of the frontend architecture, components, and implementation plan.
-   **[API Specifications](./api_specifications.md):** A complete guide to the backend API endpoints required for the application.

---

## 5. Next Steps & Pending Work

1.  **Backend Development:**
    -   Implement the API endpoints as defined in the specifications.
    -   Set up the database and storage solution.
    -   Integrate the RAG model and logic for chat, flashcard, and quiz generation.

2.  **Frontend Development:**
    -   Implement the client-side logic in `script.js` to make the UI interactive.
    -   Connect the frontend to the backend API.
    -   Add dynamic rendering for file lists, chat history, and other data.
