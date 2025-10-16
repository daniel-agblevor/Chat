document.addEventListener('DOMContentLoaded', () => {
    // --- API Configuration ---
    // Development API endpoint
    const API_BASE_URL_DEV = 'http://127.0.0.1:8000/api/v1';


    const API_BASE_URL = API_BASE_URL_DEV;
    
    let apiToken = localStorage.getItem('apiToken'); // Stores the user's authentication token.

    // --- DOM Element Selection ---
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const typingIndicator = document.getElementById('typing-indicator');
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.getElementById('menu-button');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeMainSidebarButton = document.getElementById('close-main-sidebar');
    const uploadFileButton = document.getElementById('upload-file-button');
    const fileInput = document.getElementById('file-input');
    const rightSidebarToggleButton = document.getElementById('right-sidebar-toggle-button');
    const openRightSidebarIcon = document.getElementById('open-right-sidebar-icon');
    const closeRightSidebarIcon = document.getElementById('close-right-sidebar-icon');
    const chatButton = document.getElementById('chat-button');
    const flashcardsButton = document.getElementById('flashcards-button');
    const quizButton = document.getElementById('quiz-button');
    const openSettingsButton = document.getElementById('open-settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModal = document.getElementById('close-settings-modal');
    const chatView = document.getElementById('chat-view');
    const flashcardsView = document.getElementById('flashcards-view');
    const quizView = document.getElementById('quiz-view');
    const rightSidebar = document.getElementById('right-sidebar');
    const openRightSidebarHandle = document.getElementById('open-right-sidebar-handle');
    const chatHistoryList = document.getElementById('chat-history-list');
    const chatHistoryLoading = document.getElementById('chat-history-loading');
    const chatHistoryEmpty = document.getElementById('chat-history-empty');
    const chatHistorySearch = document.getElementById('chat-history-search');
    const flashcardsRightSidebar = document.getElementById('flashcards-right-sidebar');
    const flashcardCount = document.getElementById('flashcard-count');
    const generateFlashcardsButton = document.getElementById('generate-flashcards-button');
    const flashcardGenerationLoading = document.getElementById('flashcard-generation-loading');
    const flashcardHistoryList = document.getElementById('flashcard-history-list');
    const flashcardHistorySearch = document.getElementById('flashcard-history-search');
    const quizRightSidebar = document.getElementById('quiz-right-sidebar');
    const quizQuestionCount = document.getElementById('quiz-question-count');
    const generateQuizButton = document.getElementById('generate-quiz-button');
    const quizGenerationLoading = document.getElementById('quiz-generation-loading');
    const quizHistoryList = document.getElementById('quiz-history-list');
    const quizHistorySearch = document.getElementById('quiz-history-search');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeFeedbackModal = document.getElementById('close-feedback-modal');
    const feedbackRating = document.getElementById('feedback-rating');
    const feedbackComments = document.getElementById('feedback-comments');
    const submitFeedbackButton = document.getElementById('submit-feedback-button');
    const feedbackValidation = document.getElementById('feedback-validation');
    const feedbackButton = document.getElementById('feedback-button');
    const sidebarFileList = document.getElementById('sidebar-file-list');
    const manageFilesList = document.getElementById('manage-files-list');
    const flashcard = document.getElementById('flashcard');
    const flashcardQuestion = document.getElementById('flashcard-question');
    const flashcardAnswer = document.getElementById('flashcard-answer');
    const prevCardButton = document.getElementById('prev-card-button');
    const nextCardButton = document.getElementById('next-card-button');
    const cardCounter = document.getElementById('card-counter');
    const quizQuestionEl = document.getElementById('quiz-question');
    const quizOptionsEl = document.getElementById('quiz-options');
    const quizFeedbackEl = document.getElementById('quiz-feedback');
    const nextQuestionButton = document.getElementById('next-question-button');
    const restartFlashcardsButton = document.getElementById('restart-flashcards-button');
    const restartQuizButton = document.getElementById('restart-quiz-button');
    const progressText = document.getElementById('quiz-progress-text');
    const progressBar = document.getElementById('quiz-progress-bar');
    const loginModal = document.getElementById('login-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const loginForm = document.getElementById('login-form');
    const registerModal = document.getElementById('register-modal');
    const closeRegisterModal = document.getElementById('close-register-modal');
    const registerForm = document.getElementById('register-form');
    const openRegisterModal = document.getElementById('open-register-modal');
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeSwitcherIndicator = document.getElementById('theme-switcher-indicator');
    const loginSignupButton = document.getElementById('login-signup-button');
    const fileManagementSection = document.getElementById('file-management-section');
    const openLeftSidebarHandle = document.getElementById('open-left-sidebar-handle');

    // --- App State ---
    let state = {
        files: [],
        activeFileId: null,
        isLoggedIn: false, // Assume logged out by default
        activeMode: 'chat', // Track the active mode: 'chat', 'flashcards', or 'quiz'
        isRightSidebarVisible: window.innerWidth >= 768, // Manages the visibility of the right sidebar
        chatHistory: [],
        flashcardSets: [],
        quizSets: [],
        currentFlashcards: [
            // --- Mock Flashcard Data for UI Preview ---
            // In production, this array is populated by an API call to the backend,
            // for example: GET /api/v1/files/{fileId}/flashcards
            { q: "What is the capital of France?", a: "Paris" },
            { q: "What is the chemical symbol for water?", a: "H2O" },
            { q: "Who wrote 'To Kill a Mockingbird'?", a: "Harper Lee" }
            // --- End Mock Flashcard Data ---
        ],
        currentQuiz: [
            // --- Mock Quiz Data for UI Preview ---
            // In production, this array is generated by the backend based on the document's content.
            // Example API endpoint: POST /api/v1/files/{fileId}/quizzes
            { q: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
            { q: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Great White Shark", "Giraffe"], answer: "Blue Whale" },
            { q: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Onion", "Lime"], answer: "Avocado" }
            // --- End Mock Quiz Data ---
        ],
        currentFlashcardIndex: 0,
        currentQuizIndex: 0,
        quizScore: 0,
    };

    // --- UI State Management ---

    /**
     * Switches the application to a new mode (chat, flashcards, quiz).
     * @param {string} mode The mode to switch to.
     */

    function switchMode(mode) {
        // Prevent switching to protected modes if not logged in
        if (!state.isLoggedIn && (mode === 'flashcards' || mode === 'quiz')) {
            showToast('Please log in to use this feature.', 'info');
            return;
        }
    
        const isMobile = window.innerWidth < 768;
    
        if (state.activeMode === mode) {
            // Same mode tapped again
            if (isMobile) {
                // Toggle sidebar visibility ONLY on second tap
                state.isRightSidebarVisible = !state.isRightSidebarVisible;
            }
        } else {
            // Switching to a new mode
            state.activeMode = mode;
    
            // On mobile, keep sidebar hidden until second tap
            // On desktop, keep it visible by default
            state.isRightSidebarVisible = !isMobile;
        }
    
        // Load mode-specific data
        if (mode === 'quiz') {
            loadQuizQuestion();
        } else if (mode === 'flashcards') {
            loadFlashcard(state.currentFlashcardIndex || 0);
        }
    
        // Update UI based on the new state
        updateUI();
        updateMainSidebarToggleIcon();
    }
    
    /**
     * Updates the entire UI based on the current application state (auth and active mode).
     */
    function updateUI() {
        document.body.classList.toggle('logged-in', state.isLoggedIn);
        fileManagementSection.style.display = state.isLoggedIn ? 'block' : 'none';

        if (state.isLoggedIn) {
            flashcardsButton.classList.remove('hidden');
            quizButton.classList.remove('hidden');
        } else {
            flashcardsButton.classList.add('hidden');
            quizButton.classList.add('hidden');
            state.activeMode = 'chat';
        }

        const views = { chat: chatView, flashcards: flashcardsView, quiz: quizView };
        const rightSidebars = { chat: rightSidebar, flashcards: flashcardsRightSidebar, quiz: quizRightSidebar };
        const buttons = { chat: chatButton, flashcards: flashcardsButton, quiz: quizButton };

        Object.values(views).forEach(v => v.classList.add('hidden'));
        Object.values(rightSidebars).forEach(sb => {
            sb.classList.add('hidden');
            sb.classList.remove('md:flex', 'is-open');
        });

        Object.values(buttons).forEach(b => b.classList.remove('active'));

        if (views[state.activeMode]) {
            const activeView = views[state.activeMode];
            activeView.classList.remove('hidden');
            
            // Add animation class and remove it after animation ends
            activeView.classList.add('view-enter-active');
            setTimeout(() => {
                activeView.classList.remove('view-enter-active');
            }, 300); // Must match animation duration in CSS
        }

        if (state.isLoggedIn && rightSidebars[state.activeMode]) {
            const activeSidebar = rightSidebars[state.activeMode];
            if (state.isRightSidebarVisible) {
                activeSidebar.classList.remove('hidden');
                activeSidebar.classList.add('md:flex');
                activeSidebar.classList.add('is-open');
                activeSidebar.setAttribute('aria-hidden', 'false');
                openRightSidebarIcon.classList.add('hidden');
                closeRightSidebarIcon.classList.remove('hidden');
            } else {
                activeSidebar.setAttribute('aria-hidden', 'true');
                openRightSidebarIcon.classList.remove('hidden');
                closeRightSidebarIcon.classList.add('hidden');
            }
        } else {
            openRightSidebarIcon.classList.remove('hidden');
            closeRightSidebarIcon.classList.add('hidden');
        }

        // Desktop handle visibility and label (sole toggle for right sidebars)
        if (openRightSidebarHandle) {
            const showHandle = state.isLoggedIn;
            openRightSidebarHandle.classList.toggle('hidden', !showHandle);
            const isOpen = !!state.isRightSidebarVisible;
            openRightSidebarHandle.textContent = isOpen ? '>' : '<';
            openRightSidebarHandle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            openRightSidebarHandle.setAttribute('aria-label', isOpen ? 'Hide right sidebar' : 'Open right sidebar');
        }

        if (buttons[state.activeMode]) {
            buttons[state.activeMode].classList.add('active');
        }
        
        safeCreateIcons();
    }

    // Keep the main sidebar control showing '>' when open and '<' when closed (mobile control)
    function updateMainSidebarToggleIcon() {
        if (!closeMainSidebarButton) return;
        const isOpen = !sidebar.classList.contains('-translate-x-full');
        closeMainSidebarButton.textContent = isOpen ? '>' : '<';
        closeMainSidebarButton.setAttribute('aria-label', isOpen ? 'Hide main sidebar' : 'Open main sidebar');
    }

    function updateLeftSidebarHandle() {
        if (!openLeftSidebarHandle) return;
        const isOpen = !sidebar.classList.contains('-translate-x-full');
        openLeftSidebarHandle.firstElementChild && (openLeftSidebarHandle.firstElementChild.textContent = isOpen ? '<' : '>');
        openLeftSidebarHandle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        openLeftSidebarHandle.setAttribute('aria-label', isOpen ? 'Hide main sidebar' : 'Open main sidebar');
    }


    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<p>${message}</p>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // --- API Helper ---
    async function apiRequest(endpoint, options = {}) {
        const { method = 'GET', body = null } = options;
        
        const headers = {};
        if (apiToken) {
            headers['Authorization'] = `Bearer ${apiToken}`;
        }

        if (body && !(body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers,
                body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: 'An unknown API error occurred.' } }));
                throw new Error(errorData.error.message || `API request failed with status ${response.status}`);
            }

            if (response.status === 204) return null;
            const result = await response.json();
            return result.data;
        } catch (error) {
            showToast(error.message, 'error');
            console.error(`API Error on ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    // --- Safe lucide helper ---
    function safeCreateIcons() {
        try {
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        } catch (err) {
            console.warn('lucide.createIcons() threw an error:', err);
        }
    }

    // --- File Management ---
    async function loadFiles() {
        try {
            const data = await apiRequest('/files');
            
            state.files = data.files || [];
            if (!state.activeFileId && state.files.length > 0) {
                state.activeFileId = state.files[0].id;
            }
            renderFiles();
        } catch (error) {
            console.error("Failed to load files:", error);
            showToast("Could not load your files. Please try again later.", "error");
        }
    }

    function renderFiles() {
        sidebarFileList.innerHTML = '';
        manageFilesList.innerHTML = '';
        const fileIconMap = { 'pdf': 'file-text', 'docx': 'file-text', 'txt': 'file-text', 'md': 'file-text', 'sql': 'file-code-2', 'default': 'file' };
        const fileColorMap = { 'default': 'text-accent' }; // Use a single accent color for all icons

        state.files.forEach(file => {
            const extension = file.name.split('.').pop();
            const icon = fileIconMap[extension] || fileIconMap['default'];
            const color = fileColorMap[extension] || fileColorMap['default'];
            const isActive = file.id === state.activeFileId;

            const sidebarLi = document.createElement('li');
            sidebarLi.innerHTML = `<a href="#" data-file-id="${file.id}" class="flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${isActive ? 'bg-accent text-primary-text font-semibold' : 'hover:bg-accent/20 text-text-secondary'}">
                <i data-lucide="${icon}" class="h-5 w-5 ${color}"></i><span>${file.name}</span></a>`;
            sidebarFileList.appendChild(sidebarLi);

            const manageLi = document.createElement('li');
            manageLi.className = 'flex items-center justify-between bg-bg-surface p-2.5 rounded-lg';
            manageLi.dataset.fileId = file.id;
            manageLi.innerHTML = `<div class="flex items-center gap-3"><i data-lucide="${icon}" class="h-5 w-5 ${color} flex-shrink-0"></i><span class="text-sm text-slate-200 truncate">${file.name}</span></div>
                <button class="delete-file-button p-2 rounded-md text-slate-400 hover:bg-red-500/20 hover:text-red-400"><i data-lucide="trash-2" class="h-4 w-4"></i></button>`;
            manageFilesList.appendChild(manageLi);
        });
        safeCreateIcons();
    }

    async function deleteFile(fileId) {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
            return;
        }

        try {
            await apiRequest(`/files/${fileId}`, { method: 'DELETE' });

            const fileName = state.files.find(f => f.id === fileId)?.name || 'Unknown file';
            state.files = state.files.filter(f => f.id !== fileId);
            
            if (state.activeFileId === fileId) {
                state.activeFileId = state.files.length > 0 ? state.files[0].id : null;
                chatWindow.innerHTML = '';
                renderChatHistory();
            }
            
            renderFiles();
            showToast(`File "${fileName}" has been deleted.`, 'success');
        } catch (error) {
            console.error(`Failed to delete file ${fileId}:`, error);
            showToast('Failed to delete the file. Please check your connection or try again.', 'error');
        }
    }

    manageFilesList.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-file-button');
        if (deleteButton) {
            const fileId = deleteButton.closest('li').dataset.fileId;
            deleteFile(fileId);
        }
    });

    sidebarFileList.addEventListener('click', async (e) => {
        const fileItem = e.target.closest('a');
        if (fileItem) {
            e.preventDefault();
            const fileId = fileItem.dataset.fileId;
            state.activeFileId = fileId;
            renderFiles();
        }
    });

    // --- Upload handling ---
    if (uploadFileButton && fileInput) {
        uploadFileButton.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;
            await uploadFiles(files);
            fileInput.value = '';
        });
    }

    async function uploadFiles(files) {
        const formData = new FormData();
        files.forEach(f => formData.append('files', f));

        try {
            await apiRequest('/files', { method: 'POST', body: formData });
            showToast('Files uploaded successfully and are being processed.', 'success');
            await loadFiles();
        } catch (err) {
            console.error('File upload failed:', err);
            showToast('File upload failed. Please ensure the file is a supported format and try again.', 'error');
        }
    }
    
    // --- Event Listeners for Mode Switching ---
    chatButton.addEventListener('click', () => switchMode('chat'));
    flashcardsButton.addEventListener('click', () => switchMode('flashcards'));
    quizButton.addEventListener('click', () => switchMode('quiz'));


    // --- Chat Logic ---
    async function loadChatHistory() {
        chatHistoryLoading.classList.remove('hidden');
        chatHistoryEmpty.classList.add('hidden');
        chatHistoryList.innerHTML = '';
        chatWindow.innerHTML = '';
        try {
            const data = await apiRequest(`/chat`);
            
            state.chatHistory = data.history || [];
            renderChatHistory();
            state.chatHistory.forEach(msg => addMessage(msg.message, msg.sender, false));
        } catch (error) {
            console.error(`Failed to load chat history:`, error);
            chatHistoryEmpty.classList.remove('hidden');
            addMessage("Could not load chat history. Please try again later.", 'bot', false);
        } finally {
            chatHistoryLoading.classList.add('hidden');
        }
    }

    function renderChatHistory(searchTerm = '') {
        chatHistoryList.innerHTML = '';
        const history = state.chatHistory.filter(item => item.message.toLowerCase().includes(searchTerm.toLowerCase()));

        if (history.length === 0) {
            chatHistoryEmpty.classList.remove('hidden');
            return;
        }
        chatHistoryEmpty.classList.add('hidden');
        history.forEach(item => {
            const li = document.createElement('li');
            li.className = `text-sm p-2 rounded-md bg-bg-surface`;
            li.textContent = item.message;
            chatHistoryList.appendChild(li);
        });
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = messageInput.value.trim();
        if (!userMessage) {
            showToast('Please type a message.', 'info');
            return;
        }

        addMessage(userMessage, 'user');
        messageInput.value = '';
        typingIndicator.classList.remove('hidden');
        chatWindow.scrollTop = chatWindow.scrollHeight;

        try {
            const data = await apiRequest(`/chat`, {
                method: 'POST',
                body: { message: userMessage }
            });
            addMessage(data.response.message, 'bot');
        } catch (error) {
            addMessage("Sorry, I encountered an error trying to respond. Please check your connection and try again.", 'bot', false);
        } finally {
            typingIndicator.classList.add('hidden');
        }
    });

    function addMessage(message, sender = 'bot', addToState = true) {
        const messageElement = document.createElement('div');
        messageElement.className = `flex items-start gap-2.5 sm:gap-3 justify-${sender === 'user' ? 'end' : 'start'} message-fade-in`;
        if (sender === 'user') {
            messageElement.innerHTML = `<div class="bg-accent rounded-2xl rounded-br-none p-3 sm:p-4 max-w-[80%]"><p class="text-primary-text break-words">${message}</p></div><div class="flex-shrink-0 w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center"><i data-lucide="user" class="w-5 h-5 text-text-secondary"></i></div>`;
        } else {
            messageElement.innerHTML = `<div class="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center"><i data-lucide="sparkles" class="w-5 h-5 text-accent"></i></div><div class="bg-bg-surface rounded-2xl rounded-tl-none p-3 sm:p-4 max-w-[80%]"><p class="text-text-main break-words">${message}</p></div>`;
        }
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        safeCreateIcons();

        if (addToState) {
            state.chatHistory.push({ sender, message });
            renderChatHistory();
        }
    }

    // --- Flashcard Logic ---
    async function generateFlashcards() {
        if (!state.activeFileId) {
            showToast('Please select a file first to generate flashcards.', 'error');
            return;
        }
        const count = parseInt(flashcardCount.value);
        flashcardGenerationLoading.classList.remove('hidden');
        generateFlashcardsButton.disabled = true;

        try {
            const data = await apiRequest(`/files/${state.activeFileId}/flashcards`, {
                method: 'POST',
                body: { count }
            });

            state.currentFlashcards = data.flashcards || [];
            state.currentFlashcardIndex = 0;
            loadFlashcard(0);
            await loadFlashcardHistory(state.activeFileId);
            showToast('Flashcards generated successfully!', 'success');
        } catch (error) {
            console.error("Failed to generate flashcards:", error);
            showToast('Could not generate flashcards. The document may be too short or an error occurred.', 'error');
        } finally {
            flashcardGenerationLoading.classList.add('hidden');
            generateFlashcardsButton.disabled = false;
        }
    }

    async function loadFlashcardHistory(fileId) {
        try {
            const data = await apiRequest(`/files/${fileId}/flashcards`);
            
            state.flashcardSets = data.flashcardSets || [];
            renderFlashcardHistory();
        } catch (error) {
            console.error(`Failed to load flashcard history for ${fileId}:`, error);
        }
    }

    function renderFlashcardHistory(searchTerm = '') {
        flashcardHistoryList.innerHTML = '';
    }

    function loadFlashcard(index) {
        flashcard.classList.remove('is-flipped');
        if (state.currentFlashcards.length > 0) {
            const card = state.currentFlashcards[index];
            flashcardQuestion.textContent = card.q;
            flashcardAnswer.textContent = card.a;
            cardCounter.textContent = `${index + 1} / ${state.currentFlashcards.length}`;
            // Update next button label and restart visibility
            if (nextCardButton) {
                const isLast = index >= state.currentFlashcards.length - 1;
                nextCardButton.textContent = isLast ? 'Finish' : 'Next';
            }
            if (restartFlashcardsButton) {
                restartFlashcardsButton.classList.toggle('hidden', !(index >= state.currentFlashcards.length - 1));
            }
        } else {
            flashcardQuestion.textContent = 'No flashcards generated yet.';
            flashcardAnswer.textContent = 'Generate flashcards from a file to get started.';
            cardCounter.textContent = '0 / 0';
            if (nextCardButton) nextCardButton.textContent = 'Next';
            if (restartFlashcardsButton) restartFlashcardsButton.classList.add('hidden');
        }
    }

    if (flashcard) {
        flashcard.addEventListener('click', () => flashcard.classList.toggle('is-flipped'));
    }
    if (prevCardButton) prevCardButton.addEventListener('click', () => {
        if (state.currentFlashcardIndex > 0) {
            state.currentFlashcardIndex -= 1;
            loadFlashcard(state.currentFlashcardIndex);
        }
    });
    if (nextCardButton) nextCardButton.addEventListener('click', () => {
        const lastIndex = state.currentFlashcards.length - 1;
        if (state.currentFlashcardIndex < lastIndex) {
            state.currentFlashcardIndex += 1;
            loadFlashcard(state.currentFlashcardIndex);
        } else {
            // Finished flashcards
            showToast('Flashcards complete!', 'success');
            if (restartFlashcardsButton) restartFlashcardsButton.classList.remove('hidden');
        }
    });

    if (restartFlashcardsButton) restartFlashcardsButton.addEventListener('click', () => {
        state.currentFlashcardIndex = 0;
        loadFlashcard(0);
        restartFlashcardsButton.classList.add('hidden');
    });

    // --- Quiz Logic ---
    async function generateQuiz() {
        if (!state.activeFileId) {
            showToast('Please select a file first to generate a quiz.', 'error');
            return;
        }
        const count = parseInt(quizQuestionCount.value);
        quizGenerationLoading.classList.remove('hidden');
        generateQuizButton.disabled = true;

        try {
            const data = await apiRequest(`/files/${state.activeFileId}/quizzes`, {
                method: 'POST',
                body: { questionCount: count }
            });

            state.currentQuiz = data.questions || [];
            state.currentQuizIndex = 0;
            state.quizScore = 0;
            loadQuizQuestion();
            await loadQuizHistory(state.activeFileId);
            showToast('Quiz generated successfully!', 'success');
        } catch (error) {
            console.error("Failed to generate quiz:", error);
            showToast('Could not generate a quiz. The document may not be suitable or an error occurred.', 'error');
        } finally {
            quizGenerationLoading.classList.add('hidden');
            generateQuizButton.disabled = false;
        }
    }

    async function loadQuizHistory(fileId) {
        try {
            const data = await apiRequest(`/files/${fileId}/quizzes`);
            
            state.quizSets = data.quizzes || [];
            renderQuizHistory();
        } catch (error) {
            console.error(`Failed to load quiz history for ${fileId}:`, error);
        }
    }

    function renderQuizHistory(searchTerm = '') {
        quizHistoryList.innerHTML = '';
    }

    function loadQuizQuestion() {
        quizFeedbackEl.textContent = '';
        quizOptionsEl.innerHTML = '';
        nextQuestionButton.classList.add('hidden');
        Array.from(quizOptionsEl.children).forEach(btn => btn.disabled = false);

        if (state.currentQuiz.length === 0) {
            quizQuestionEl.textContent = 'No quiz available. Generate one from a file!';
            progressText.textContent = 'Question 0 of 0';
            progressBar.style.width = '0%';
            return;
        }

        if (state.currentQuizIndex >= state.currentQuiz.length) {
            quizQuestionEl.textContent = `Quiz Complete! You scored ${state.quizScore} out of ${state.currentQuiz.length}.`;
            progressText.textContent = 'Finished!';
            progressBar.style.width = '100%';
            if (restartQuizButton) restartQuizButton.classList.remove('hidden');
            return;
        }

        const question = state.currentQuiz[state.currentQuizIndex];
        progressText.textContent = `Question ${state.currentQuizIndex + 1} of ${state.currentQuiz.length}`;
        progressBar.style.width = `${((state.currentQuizIndex + 1) / state.currentQuiz.length) * 100}%`;
        quizQuestionEl.textContent = question.q;
        
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option; // Classes are now handled in style.css for .mode-button
            button.className = 'text-left p-4 mode-button rounded-lg';
            button.onclick = () => selectQuizAnswer(button, option, question.answer);
            quizOptionsEl.appendChild(button);
        });
    }

    if (openLeftSidebarHandle) {
        openLeftSidebarHandle.addEventListener('click', () => {
            const isOpen = !sidebar.classList.contains('-translate-x-full');
            if (isOpen) {
                sidebar.classList.add('-translate-x-full');
                sidebarOverlay.classList.add('hidden');
            } else {
                sidebar.classList.remove('-translate-x-full');
                sidebarOverlay.classList.add('hidden');
            }
            updateMainSidebarToggleIcon();
            updateLeftSidebarHandle();
        });
    }

    function selectQuizAnswer(button, selected, correct) {
        Array.from(quizOptionsEl.children).forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('active'); // Remove general active state
            if (btn.textContent === correct) {
                btn.classList.add('correct-answer');
            }
        });
        
        if (selected === correct) {
            state.quizScore++;
            quizFeedbackEl.textContent = 'Correct!';
            quizFeedbackEl.className = 'text-center mb-4 text-accent';
        } else {
            button.classList.add('incorrect-answer');
            quizFeedbackEl.textContent = `Incorrect. The correct answer is "${correct}".`;
            quizFeedbackEl.className = 'text-center mb-4 text-emphasis'; // Use emphasis for incorrect
        }
        state.currentQuizIndex++;
        nextQuestionButton.classList.remove('hidden');
        // If next action will complete the quiz, label as Finish
        if (state.currentQuizIndex >= state.currentQuiz.length) {
            nextQuestionButton.textContent = 'Finish';
        } else {
            nextQuestionButton.textContent = 'Next Question';
        }
    }

    if (nextQuestionButton) nextQuestionButton.addEventListener('click', () => {
        loadQuizQuestion();
        // Reset label after loading if not finished
        if (state.currentQuizIndex < state.currentQuiz.length) {
            nextQuestionButton.textContent = 'Next Question';
        }
    });

    if (restartQuizButton) restartQuizButton.addEventListener('click', () => {
        state.currentQuizIndex = 0;
        state.quizScore = 0;
        restartQuizButton.classList.add('hidden');
        loadQuizQuestion();
    });

    // --- Feedback ---
    feedbackButton.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
        feedbackModal.classList.remove('hidden');
    });

    closeFeedbackModal.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
    });

    // Select all star buttons
    const stars = document.querySelectorAll('.star');

    stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        // Remove 'active' class from all stars
        stars.forEach((s) => s.classList.remove('active'));

        // Add 'active' class up to the clicked star
        for (let i = 0; i <= index; i++) {
        stars[i].classList.add('active');
        }

        // Optional: store selected rating value
        const rating = star.getAttribute('data-rating');
        console.log('Selected Rating:', rating);
    });

    // Optional hover preview effect (temporary highlight)
    star.addEventListener('mouseover', () => {
        stars.forEach((s, i) => {
        s.style.color = i <= index ? '#FCA311' : '#9CA3AF';
        });
    });

    star.addEventListener('mouseout', () => {
        // Revert to active stars only
        stars.forEach((s) => {
        s.style.color = s.classList.contains('active') ? '#FCA311' : '#9CA3AF';
        });
    });
    });


    async function submitFeedback() {
        const rating = feedbackRating.querySelectorAll('.active').length;
        const comments = feedbackComments.value.trim();

        if (rating === 0) {
            feedbackValidation.textContent = 'Please select a star rating.';
            feedbackValidation.classList.remove('hidden');
            return;
        }
        feedbackValidation.classList.add('hidden');
        
        try {
            await apiRequest('/feedback', { 
                method: 'POST', 
                body: { 
                    rating, 
                    comments, 
                    fileId: state.activeFileId 
                } 
            });
            showToast('Thank you for your feedback!', 'success');
        } catch (err) {
            console.error('Failed to submit feedback:', err);
            showToast('Failed to submit feedback. Please try again later.', 'error');
            return;
        }

        feedbackModal.classList.add('hidden');
        
        feedbackComments.value = '';
        Array.from(feedbackRating.children).forEach(star => {
            star.classList.remove('active');
        });
    }

    submitFeedbackButton.addEventListener('click', submitFeedback);

    if (generateFlashcardsButton) generateFlashcardsButton.addEventListener('click', generateFlashcards);
    if (generateQuizButton) generateQuizButton.addEventListener('click', generateQuiz);

    if (menuButton) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebarOverlay.classList.toggle('hidden');
            updateMainSidebarToggleIcon();
        });
    }
    if (closeMainSidebarButton) {
        closeMainSidebarButton.addEventListener('click', () => {
            // Close main sidebar (primarily for mobile)
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
            updateMainSidebarToggleIcon();
        });
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
            updateMainSidebarToggleIcon();
        });
    }

    function setupRightSidebarTogglePerViewport() {
        if (!rightSidebarToggleButton) return;
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            rightSidebarToggleButton.classList.remove('hidden');
            rightSidebarToggleButton.onclick = () => {
                state.isRightSidebarVisible = !state.isRightSidebarVisible;
                updateUI();
            };
        } else {
            rightSidebarToggleButton.classList.add('hidden');
            rightSidebarToggleButton.onclick = null;
        }
    }
    setupRightSidebarTogglePerViewport();
    window.addEventListener('resize', setupRightSidebarTogglePerViewport);

    if (openRightSidebarHandle) {
        openRightSidebarHandle.addEventListener('click', () => {
            state.isRightSidebarVisible = !state.isRightSidebarVisible;
            updateUI();
        });
    }

    // --- Mobile Right Sidebar Click-Outside-to-Close ---
    function setupMobileSidebarClickOutside() {
        // Only apply to mobile viewports
        if (window.innerWidth >= 768) return;
        
        // Get the main content area (where users can click to close sidebar)
        const mainContent = document.querySelector('.flex.flex-col.flex-1.overflow-hidden');
        
        if (mainContent) {
            mainContent.addEventListener('click', (e) => {
                // Only close if sidebar is visible and we're on mobile
                if (state.isRightSidebarVisible && window.innerWidth < 768) {
                    // Check if the click is not on the sidebar itself
                    const rightSidebars = [rightSidebar, flashcardsRightSidebar, quizRightSidebar];
                    const activeSidebar = rightSidebars.find(sidebar => 
                        sidebar && !sidebar.classList.contains('hidden')
                    );
                    
                    // Don't close if clicking on mode buttons (they have their own logic)
                    const isModeButton = e.target.closest('.mode-button') || 
                                       e.target.closest('#chat-button') || 
                                       e.target.closest('#flashcards-button') || 
                                       e.target.closest('#quiz-button');
                    
                    if (activeSidebar && !activeSidebar.contains(e.target) && !isModeButton) {
                        state.isRightSidebarVisible = false;
                        updateUI();
                    }
                }
            });
        }
    }

    // Setup click-outside-to-close on mobile
    setupMobileSidebarClickOutside();
    
    // Re-setup on window resize to handle mobile/desktop transitions
    window.addEventListener('resize', () => {
        setupMobileSidebarClickOutside();
    });

    // --- Modal and Auth Logic ---
    openSettingsButton.addEventListener('click', () => {
        if (state.isLoggedIn) {
            settingsModal.classList.remove('hidden');
        } else {
            loginModal.classList.remove('hidden');
        }
    });

    loginSignupButton.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        state.isLoggedIn = true;
        loginModal.classList.add('hidden');
        initializeApp();
        showToast('Login successful!', 'success');
    });

    closeSettingsModal.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    openRegisterModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        registerModal.classList.remove('hidden');
    });

    closeRegisterModal.addEventListener('click', () => {
        registerModal.classList.add('hidden');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('register-password').value;
        const passwordConfirm = document.getElementById('register-password-confirm').value;

        if (password !== passwordConfirm) {
            showToast('Passwords do not match.', 'error');
            return;
        }

        console.log('Registering user...');
        registerModal.classList.add('hidden');
        showToast('Registration successful! Please log in.', 'success');
        loginModal.classList.remove('hidden');
    });

    // --- App Initialization ---
    function createBouncingCircles() {
        const container = document.getElementById('background-animation');
        if (!container) return;

        const circleCount = 10;

        for (let i = 0; i < circleCount; i++) {
            const circle = document.createElement('div');
            circle.classList.add('bouncing-circle');

            const size = Math.random() * 150 + 50; // 50px to 200px
            const initialX = Math.random() * 100;
            const initialY = Math.random() * 100;
            const animationDuration = Math.random() * 20 + 15; // 15s to 35s
            const colorAnimationDuration = Math.random() * 10 + 5; // 5s to 15s
            const animationDelay = Math.random() * 10;

            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            circle.style.left = `${initialX}%`;
            circle.style.top = `${initialY}%`;
            circle.style.animationDuration = `${animationDuration}s, ${colorAnimationDuration}s`;
            circle.style.animationDelay = `${animationDelay}s`;

            container.appendChild(circle);
        }
    }

    async function initializeApp() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);

        createBouncingCircles(); 

        await loadChatHistory();
        if (state.isLoggedIn) {
            await loadFiles();
        }
        
        updateUI();
        updateMainSidebarToggleIcon();
        updateLeftSidebarHandle();
    }

    // --- Theme Management ---
    function applyTheme(theme) {
        document.body.classList.toggle('light-mode', theme === 'light');
        themeSwitcherIndicator.classList.toggle('translate-x-5', theme === 'light');
    }

    themeSwitcher.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // Detect system preference at first load (only if no user preference)
    const storedTheme = localStorage.getItem('theme');
    if (!storedTheme) {
        const prefersLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLightMode ? 'light' : 'dark');
    } else {
        applyTheme(storedTheme);
    }

    // Listen for real-time system theme changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
        // Only auto-switch if user hasn't set a manual preference
        if (!localStorage.getItem('theme')) {
            const newTheme = event.matches ? 'light' : 'dark';
            applyTheme(newTheme);
        }
    });

    initializeApp();
});
