# Frontend API Implementation Plan (Completed)

This document provides a comprehensive guide for the frontend team on how to interact with the StarLight AI backend API. **The implementation of this plan is complete.**

## 1. Authentication

Authentication is handled using JSON Web Tokens (JWT). To make authenticated requests, you need to include an access token in the `Authorization` header of your requests.

### a. User Registration

To create a new user account, send a `POST` request to the `/api/accounts/register/` endpoint.

**Example:**

```javascript
async function registerUser(username, email, password) {
    const response = await fetch('https://starlight-ai-129919759539.europe-west1.run.app/api/accounts/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            password2: password,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log('User registered successfully:', data);
    } else {
        console.error('Registration failed:', response.statusText);
    }
}
```

### b. User Login

To log in and get an access token, send a `POST` request to the `/api/accounts/login/` endpoint.

**Example:**

```javascript
async function loginUser(username, password) {
    const response = await fetch('https://starlight-ai-129919759539.europe-west1.run.app/api/accounts/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        // Store the access and refresh tokens in local storage
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        console.log('User logged in successfully');
    } else {
        console.error('Login failed:', response.statusText);
    }
}
```

### c. Refreshing Access Tokens

Access tokens have a limited lifetime. When an access token expires, you can get a new one by sending a `POST` request to the `/api/accounts/token/refresh/` endpoint with your refresh token.

**Example:**

```javascript
async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('https://starlight-ai-129919759539.europe-west1.run.app/api/accounts/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refresh: refreshToken,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        // Store the new access token
        localStorage.setItem('accessToken', data.access);
        console.log('Token refreshed successfully');
    } else {
        console.error('Token refresh failed:', response.statusText);
    }
}
```

## 2. File Management

These endpoints allow authenticated users to manage their private documents for RAG.

### a. List User's Files

To get a list of the user's files, send a `GET` request to the `/api/chat/v1/files` endpoint.

**Example:**

```javascript
async function getFiles() {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/files', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Files:', data);
    } else {
        console.error('Failed to get files:', response.statusText);
    }
}
```

### b. Upload a File

To upload a file, send a `POST` request to the `/api/chat/v1/files` endpoint with the file in a `multipart/form-data` request.

**Example:**

```javascript
async function uploadFile(file) {
    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/files', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
    });

    if (response.ok) {
        const data = await response.json();
        console.log('File uploaded successfully:', data);
    } else {
        console.error('File upload failed:', response.statusText);
    }
}
```

### c. Delete a File

To delete a file, send a `DELETE` request to the `/api/chat/v1/files/<file_id>` endpoint.

**Example:**

```javascript
async function deleteFile(fileId) {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/files/${fileId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        console.log('File deleted successfully');
    } else {
        console.error('File deletion failed:', response.statusText);
    }
}
```

## 3. Chat

To send a chat message, send a `POST` request to the `/api/chat/v1/chat/` endpoint.

**Example:**

```javascript
async function sendMessage(message) {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/chat/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            message: message,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Response:', data.response);
    } else {
        console.error('Failed to send message:', response.statusText);
    }
}
```

## 4. Settings

To update user settings, send a `POST` request to the `/api/chat/v1/settings` endpoint.

**Example:**

```javascript
async function updateSettings(settings) {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(settings),
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Settings updated successfully:', data);
    } else {
        console.error('Failed to update settings:', response.statusText);
    }
}
```

## 5. Feedback

To submit feedback, send a `POST` request to the `/api/chat/v1/feedback` endpoint.

**Example:**

```javascript
async function submitFeedback(feedback) {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch('https://starlight-ai-129919759539.europe-west1.run.app/api/chat/v1/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(feedback),
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Feedback submitted successfully:', data);
    } else {
        console.error('Failed to submit feedback:', response.statusText);
    }
}
```

## 6. Implementation Notes

The frontend has been successfully updated to integrate with the backend API. All functions in `script.js` now make live API calls to the specified endpoints. Authentication is handled via JWT, and a token refresh mechanism has been implemented to handle expired tokens. The UI has been updated to reflect the live data and authentication state.
