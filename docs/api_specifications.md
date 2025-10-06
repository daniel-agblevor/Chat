# API Specifications

## 1. Overview

This document outlines the API endpoints for the Starlight RAG application. The API is responsible for handling chat interactions, generating flashcards, and creating quizzes based on user-provided documents.

**Date:** October 6, 2025

---

## 2. Authentication

-   **Endpoint:** `/api/auth`
-   **Method:** `POST`
-   **Description:** Authenticates the user. (Details TBD)

---

## 3. File Operations

### 3.1. Upload File

-   **Endpoint:** `/api/files/upload`
-   **Method:** `POST`
-   **Description:** Uploads a file for processing.
-   **Request Body:** `multipart/form-data` with the file.
-   **Response:**
    -   `200 OK`: `{ "file_id": "...", "filename": "..." }`
    -   `400 Bad Request`: Error message.

### 3.2. List Files

-   **Endpoint:** `/api/files`
-   **Method:** `GET`
-   **Description:** Retrieves a list of uploaded files for the user.
-   **Response:**
    -   `200 OK`: `[{ "file_id": "...", "filename": "..." }]`

### 3.3. Delete File

-   **Endpoint:** `/api/files/{file_id}`
-   **Method:** `DELETE`
-   **Description:** Deletes a specific file.
-   **Response:**
    -   `204 No Content`
    -   `404 Not Found`

---

## 4. Chat

-   **Endpoint:** `/api/chat`
-   **Method:** `POST`
-   **Description:** Sends a user message to the chat model and gets a response.
-   **Request Body:** `{ "message": "...", "file_ids": ["..."] }`
-   **Response:**
    -   `200 OK`: `{ "response": "..." }` (Can be a stream)

---

## 5. Flashcards

### 5.1. Generate Flashcards

-   **Endpoint:** `/api/flashcards/generate`
-   **Method:** `POST`
-   **Description:** Generates a set of flashcards from a document.
-   **Request Body:** `{ "file_id": "...", "count": 10 }`
-   **Response:**
    -   `200 OK`: `{ "flashcard_set_id": "...", "flashcards": [{ "question": "...", "answer": "..." }] }`

### 5.2. Get Flashcard History

-   **Endpoint:** `/api/flashcards/history`
-   **Method:** `GET`
-   **Description:** Retrieves previously generated flashcard sets.
-   **Response:**
    -   `200 OK`: `[{ "flashcard_set_id": "...", "created_at": "..." }]`

---

## 6. Quiz

### 6.1. Generate Quiz

-   **Endpoint:** `/api/quiz/generate`
-   **Method:** `POST`
-   **Description:** Generates a quiz from a document.
-   **Request Body:** `{ "file_id": "...", "question_count": 5 }`
-   **Response:**
    -   `200 OK`: `{ "quiz_id": "...", "questions": [{ "question": "...", "options": ["...", "...", "..."], "correct_answer": "..." }] }`

### 6.2. Get Quiz History

-   **Endpoint:** `/api/quiz/history`
-   **Method:** `GET`
-   **Description:** Retrieves previously generated quizzes.
-   **Response:**
    -   `200 OK`: `[{ "quiz_id": "...", "score": "...", "created_at": "..." }]`

---

## Pending Work

-   Finalize authentication mechanism.
-   Define error response structures.
-   Implement streaming for chat responses.
-   Add pagination for history endpoints.
