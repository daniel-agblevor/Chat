# Starlight RAG API Specification

**Version:** 1.0
Date: October 10, 2025

## 1. Introduction

This document provides a comprehensive specification for the Starlight RAG RESTful API. This API enables the frontend application to manage files, interact with a Retrieval-Augmented Generation (RAG) chat model, generate and review flashcards, create and take quizzes, and submit user feedback.

### 1.1. Base URL

All API endpoints are prefixed with the following base URL:

```
https://starlight-ai-129919759539.europe-west1.run.app
```

### 1.2. Authentication

The API uses JSON Web Tokens (JWT) for authentication. All protected requests must include an `Authorization` header with a bearer token.

**Header Example:**
`Authorization: Bearer <YOUR_ACCESS_TOKEN>`

The API has endpoints for user registration, login, and token refreshing.

### 1.3. Standard Response Formats

#### Success Response

Successful `GET`, `POST`, and `PUT` requests will return a `200 OK` or `201 Created` status with a JSON body containing a `data` object.

```json
{
  "status": "success",
  "data": {
    "key": "value"
  }
}
```

#### Error Response

Failed requests will return an appropriate `4xx` or `5xx` status code with a JSON body detailing the error.

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "A human-readable error message."
  }
}
```

---

## 2. File Management

Endpoints for uploading, listing, and deleting user files.

### 2.1. List Files

- **Description:** Retrieves a list of all files uploaded by the user.
- **Endpoint:** `GET /files`
- **Success Response:** `200 OK`
- **Payload:**
  ```json
  {
    "status": "success",
    "data": {
      "files": [
        {
          "id": "file-abc-123",
          "name": "Q3_Sales_Report.pdf",
          "type": "application/pdf",
          "size": 1048576,
          "createdAt": "2025-10-06T10:00:00Z"
        }
      ]
    }
  }
  ```

### 2.2. Upload File

- **Description:** Uploads one or more files for processing.
- **Endpoint:** `POST /files`
- **Request:** `multipart/form-data`
- **Success Response:** `201 Created`
- **cURL Example:**
  ```bash
  curl -X POST \
    https://api.starlightrag.com/v1/files \
    -H "Authorization: Bearer <TOKEN>" \
    -F "file=@/path/to/your/file.pdf"
  ```

### 2.3. Get File Details

- **Description:** Retrieves metadata for a single file.
- **Endpoint:** `GET /files/{fileId}`
- **Success Response:** `200 OK`
- **Payload:**
  ```json
  {
    "status": "success",
    "data": {
      "file": {
        "id": "file-abc-123",
        "name": "Q3_Sales_Report.pdf",
        "type": "application/pdf",
        "size": 1048576,
        "createdAt": "2025-10-06T10:00:00Z",
        "status": "processed"
      }
    }
  }
  ```

### 2.4. Delete File

- **Description:** Deletes a specific file and all associated data (chat history, flashcards, etc.).
- **Endpoint:** `DELETE /files/{fileId}`
- **Success Response:** `204 No Content`

---

## 3. Chat Interaction

Endpoints for interacting with the RAG model.

### 3.1. Get Chat History

- **Description:** Retrieves the full chat history for a specific file.
- **Endpoint:** `GET /files/{fileId}/chat`
- **Success Response:** `200 OK`
- **Payload:**
  ```json
  {
    "status": "success",
    "data": {
      "history": [
        { "sender": "bot", "message": "Hello! How can I help you with Q3_Sales_Report.pdf?", "timestamp": "2025-10-06T10:05:00Z" },
        { "sender": "user", "message": "What was the total revenue?", "timestamp": "2025-10-06T10:05:15Z" }
      ]
    }
  }
  ```

### 3.2. Send Message

- **Description:** Sends a message to the chat model for a specific file and receives a response.
- **Endpoint:** `POST /files/{fileId}/chat`
- **Request Body:**
  ```json
  {
    "message": "What was the total revenue?"
  }
  ```
- **Success Response:** `200 OK` (Can be a standard JSON response or a server-sent event stream for real-time typing effects).
- **Payload (JSON):**
  ```json
  {
    "status": "success",
    "data": {
      "response": {
        "sender": "bot",
        "message": "The total revenue for Q3 was $1.2M.",
        "timestamp": "2025-10-06T10:05:20Z"
      }
    }
  }
  ```

---

## 4. Flashcards

Endpoints for generating and managing flashcard sets.

### 4.1. Generate Flashcards

- **Description:** Generates a new set of flashcards from a file.
- **Endpoint:** `POST /files/{fileId}/flashcards`
- **Request Body:**
  ```json
  {
    "count": 10
  }
  ```
- **Success Response:** `201 Created`
- **Payload:**
  ```json
  {
    "status": "success",
    "data": {
      "flashcardSetId": "flash-set-xyz-789",
      "flashcards": [
        { "q": "Generated Question 1", "a": "Generated Answer 1" },
        { "q": "Generated Question 2", "a": "Generated Answer 2" }
      ]
    }
  }
  ```

### 4.2. Get Flashcard History

- **Description:** Retrieves a list of all flashcard sets generated for a file.
- **Endpoint:** `GET /files/{fileId}/flashcards`
- **Success Response:** `200 OK`
- **Payload:**
  ```json
  {
    "status": "success",
    "data": {
      "flashcardSets": [
        {
          "id": "flash-set-xyz-789",
          "count": 10,
          "createdAt": "2025-10-06T11:00:00Z"
        }
      ]
    }
  }
  ```

---

## 5. Quizzes

Endpoints for generating and managing quizzes.

### 5.1. Generate Quiz

- **Description:** Generates a new quiz from a file.
- **Endpoint:** `POST /files/{fileId}/quizzes`
- **Request Body:**
  ```json
  {
    "questionCount": 5
  }
  ```
- **Success Response:** `201 Created`
- **Payload:**
  ```json
  {
    "status": "success",
    "data": {
      "quizId": "quiz-def-456",
      "questions": [
        {
          "q": "Generated Question 1",
          "options": ["Option A", "Option B", "Option C"],
          "answer": "Option A"
        }
      ]
    }
  }
  ```

### 5.2. Get Quiz History

- **Description:** Retrieves a list of all quizzes generated for a file.
- **Endpoint:** `GET /files/{fileId}/quizzes`
- **Success Response:** `200 OK`
- **Payload:**
  ```json
  {
    "status": "success",
    "data": {
      "quizzes": [
        {
          "id": "quiz-def-456",
          "questionCount": 5,
          "createdAt": "2025-10-06T12:00:00Z"
        }
      ]
    }
  }
  ```

---

## 6. User Feedback

Endpoint for collecting feedback from users.

### 6.1. Submit Feedback

- **Description:** Submits user feedback, including a star rating and comments.
- **Endpoint:** `POST /feedback`
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comments": "This is a great feature!"
  }
  ```
- **Success Response:** `202 Accepted`
- **Payload:**
  ```json
  {
    "status": "success",
    "data": {
      "message": "Feedback received. Thank you!"
    }
  }
  ```
