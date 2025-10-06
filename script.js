document.addEventListener('DOMContentLoaded', () => {
    // --- API Configuration ---
    const API_BASE_URL = 'https://api.starlightrag.com/v1';
    const API_TOKEN = 'YOUR_API_TOKEN'; // IMPORTANT: Replace with a real token management solution

    // --- DOM Element Selection ---
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const typingIndicator = document.getElementById('typing-indicator');
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.getElementById('menu-button');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
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
    const closeRightSidebar = document.getElementById('close-right-sidebar');
    const closeFlashcardsRightSidebar = document.getElementById('close-flashcards-right-sidebar');
    const closeQuizRightSidebar = document.getElementById('close-quiz-right-sidebar');
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
    const progressText = document.getElementById('quiz-progress-text');
    const progressBar = document.getElementById('quiz-progress-bar');

    // --- App State ---
    let state = {
        files: [],
        activeFileId: null,
        chatHistory: [],
        flashcardSets: [],
        quizSets: [],
        currentFlashcards: [],
        currentQuiz: [],
        currentFlashcardIndex: 0,
        currentQuizIndex: 0,
        quizScore: 0,
    };

    // --- API Helper ---
    async function apiRequest(endpoint, options = {}) {
        const { method = 'GET', body = null } = options;
        const headers = { 'Authorization': `Bearer ${API_TOKEN}` };
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
            if (state.activeFileId) {
                await loadChatHistory(state.activeFileId);
            }
        } catch (error) {
            console.error("Failed to load files:", error);
        }
    }

    function renderFiles() {
        sidebarFileList.innerHTML = '';
        manageFilesList.innerHTML = '';
        const fileIconMap = { 'pdf': 'file-text', 'docx': 'file-text', 'sql': 'file-code-2', 'default': 'file' };
        const fileColorMap = { 'pdf': 'text-violet-400', 'docx': 'text-sky-400', 'sql': 'text-indigo-400', 'default': 'text-slate-400' };

        state.files.forEach(file => {
            const extension = file.name.split('.').pop();
            const icon = fileIconMap[extension] || fileIconMap['default'];
            const color = fileColorMap[extension] || fileColorMap['default'];
            const isActive = file.id === state.activeFileId;

            const sidebarLi = document.createElement('li');
            sidebarLi.innerHTML = `<a href="#" data-file-id="${file.id}" class="flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${isActive ? 'bg-slate-800/60 text-slate-100 font-semibold' : 'hover:bg-slate-800/50 text-slate-300'}">
                <i data-lucide="${icon}" class="h-5 w-5 ${color}"></i><span>${file.name}</span></a>`;
            sidebarFileList.appendChild(sidebarLi);

            const manageLi = document.createElement('li');
            manageLi.className = 'flex items-center justify-between bg-slate-800/50 p-2.5 rounded-lg';
            manageLi.dataset.fileId = file.id;
            manageLi.innerHTML = `<div class="flex items-center gap-3"><i data-lucide="${icon}" class="h-5 w-5 ${color} flex-shrink-0"></i><span class="text-sm text-slate-200 truncate">${file.name}</span></div>
                <button class="delete-file-button p-2 rounded-md text-slate-400 hover:bg-red-500/20 hover:text-red-400"><i data-lucide="trash-2" class="h-4 w-4"></i></button>`;
            manageFilesList.appendChild(manageLi);
        });
        safeCreateIcons();
    }

    async function deleteFile(fileId) {
        try {
            await apiRequest(`/files/${fileId}`, { method: 'DELETE' });
            const fileName = state.files.find(f => f.id === fileId)?.name;
            state.files = state.files.filter(f => f.id !== fileId);
            if (state.activeFileId === fileId) {
                state.activeFileId = state.files.length > 0 ? state.files[0].id : null;
                if (state.activeFileId) await loadChatHistory(state.activeFileId);
                else renderChatHistory();
            }
            renderFiles();
            showToast(`File "${fileName}" deleted.`, 'success');
        } catch (error) {
            console.error(`Failed to delete file ${fileId}:`, error);
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
            await loadChatHistory(fileId);
        }
    });

    // --- Chat Logic ---
    async function loadChatHistory(fileId) {
        chatHistoryLoading.classList.remove('hidden');
        chatHistoryEmpty.classList.add('hidden');
        chatHistoryList.innerHTML = '';
        chatWindow.innerHTML = '';
        try {
            const data = await apiRequest(`/files/${fileId}/chat`);
            state.chatHistory = data.history || [];
            renderChatHistory();
            state.chatHistory.forEach(msg => addMessage(msg.message, msg.sender, false));
        } catch (error) {
            console.error(`Failed to load chat history for ${fileId}:`, error);
            chatHistoryEmpty.classList.remove('hidden');
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
            li.className = `text-sm p-2 rounded-md ${item.sender === 'user' ? 'bg-slate-700' : 'bg-slate-800'}`;
            li.textContent = item.message;
            chatHistoryList.appendChild(li);
        });
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = messageInput.value.trim();
        if (!userMessage || !state.activeFileId) return;

        addMessage(userMessage, 'user');
        messageInput.value = '';
        typingIndicator.classList.remove('hidden');
        chatWindow.scrollTop = chatWindow.scrollHeight;

        try {
            const data = await apiRequest(`/files/${state.activeFileId}/chat`, {
                method: 'POST',
                body: { message: userMessage }
            });
            addMessage(data.response.message, 'bot');
        } catch (error) {
            addMessage("Sorry, I couldn't get a response. Please try again.", 'bot');
        } finally {
            typingIndicator.classList.add('hidden');
        }
    });

    function addMessage(message, sender = 'bot', addToState = true) {
        const messageElement = document.createElement('div');
        messageElement.className = `flex items-start gap-2.5 sm:gap-3 justify-${sender === 'user' ? 'end' : 'start'} message-fade-in`;
        if (sender === 'user') {
            messageElement.innerHTML = `<div class="bg-violet-600 rounded-2xl rounded-br-none p-3 sm:p-4 max-w-[80%]"><p class="text-white break-words">${message}</p></div><div class="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><i data-lucide="user" class="w-5 h-5 text-slate-400"></i></div>`;
        } else {
            messageElement.innerHTML = `<div class="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center"><i data-lucide="sparkles" class="w-5 h-5 text-violet-400"></i></div><div class="bg-slate-800/50 rounded-2xl rounded-tl-none p-3 sm:p-4 max-w-[80%]"><p class="text-slate-200 break-words">${message}</p></div>`;
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
            showToast('Please select a file first.', 'error');
            return;
        }
        const count = parseInt(flashcardCount.value);
        flashcardGenerationLoading.classList.remove('hidden');
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
        } finally {
            flashcardGenerationLoading.classList.add('hidden');
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
        // This needs adjustment based on what we want to show. For now, it's empty.
    }

    function loadFlashcard(index) {
        flashcard.classList.remove('is-flipped');
        if (state.currentFlashcards.length > 0) {
            const card = state.currentFlashcards[index];
            flashcardQuestion.textContent = card.q;
            flashcardAnswer.textContent = card.a;
            cardCounter.textContent = `${index + 1} / ${state.currentFlashcards.length}`;
        } else {
            flashcardQuestion.textContent = 'No flashcards generated yet.';
            flashcardAnswer.textContent = 'Generate flashcards from a file to get started.';
            cardCounter.textContent = '0 / 0';
        }
    }

    // --- Quiz Logic ---
    async function generateQuiz() {
        if (!state.activeFileId) {
            showToast('Please select a file first.', 'error');
            return;
        }
        const count = parseInt(quizQuestionCount.value);
        quizGenerationLoading.classList.remove('hidden');
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
        } finally {
            quizGenerationLoading.classList.add('hidden');
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
        // This needs adjustment. For now, it's empty.
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
            return;
        }

        const question = state.currentQuiz[state.currentQuizIndex];
        progressText.textContent = `Question ${state.currentQuizIndex + 1} of ${state.currentQuiz.length}`;
        progressBar.style.width = `${((state.currentQuizIndex + 1) / state.currentQuiz.length) * 100}%`;
        quizQuestionEl.textContent = question.q;
        
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'text-left p-4 bg-slate-800/60 hover:bg-violet-600/50 rounded-lg';
            button.onclick = () => selectQuizAnswer(button, option, question.answer);
            quizOptionsEl.appendChild(button);
        });
    }

    function selectQuizAnswer(button, selected, correct) {
        Array.from(quizOptionsEl.children).forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correct) btn.classList.add('bg-green-500/80');
        });
        
        if (selected === correct) {
            state.quizScore++;
            quizFeedbackEl.textContent = 'Correct!';
            quizFeedbackEl.className = 'text-center mb-4 text-green-400';
        } else {
            button.classList.add('bg-red-500/80');
            quizFeedbackEl.textContent = `Incorrect. The correct answer is "${correct}"`;
            quizFeedbackEl.className = 'text-center mb-4 text-red-400';
        }
        state.currentQuizIndex++;
        nextQuestionButton.classList.remove('hidden');
    }

    // --- Feedback ---
    async function submitFeedback() {
        const rating = parseInt(feedbackRating.querySelector('.text-yellow-400')?.dataset.rating || 0);
        const comments = feedbackComments.value;
        if (rating === 0) {
            feedbackValidation.classList.remove('hidden');
            return;
        }
        feedbackValidation.classList.add('hidden');
        try {
            await apiRequest('/feedback', { method: 'POST', body: { rating, comments } });
            showToast('Thank you for your feedback!', 'success');
            feedbackModal.classList.add('hidden');
        } catch (error) {
            console.error("Failed to submit feedback:", error);
        }
    }

    // --- UI Controls & Event Listeners ---
    function setupEventListeners() {
        menuButton.addEventListener('click', (e) => { e.stopPropagation(); sidebar.classList.toggle('-translate-x-full'); sidebarOverlay.classList.toggle('hidden'); });
        sidebarOverlay.addEventListener('click', () => { sidebar.classList.toggle('-translate-x-full'); sidebarOverlay.classList.toggle('hidden'); });
        chatButton.addEventListener('click', () => switchView('chat'));
        flashcardsButton.addEventListener('click', () => switchView('flashcards'));
        quizButton.addEventListener('click', () => switchView('quiz'));
        openSettingsButton.addEventListener('click', () => settingsModal.classList.remove('hidden'));
        closeSettingsModal.addEventListener('click', () => settingsModal.classList.add('hidden'));
        feedbackButton.addEventListener('click', () => feedbackModal.classList.remove('hidden'));
        closeFeedbackModal.addEventListener('click', () => feedbackModal.classList.add('hidden'));
        submitFeedbackButton.addEventListener('click', submitFeedback);
        generateFlashcardsButton.addEventListener('click', generateFlashcards);
        generateQuizButton.addEventListener('click', generateQuiz);
        flashcard.addEventListener('click', () => flashcard.classList.toggle('is-flipped'));
        nextCardButton.addEventListener('click', () => { state.currentFlashcardIndex = (state.currentFlashcardIndex + 1) % state.currentFlashcards.length; loadFlashcard(state.currentFlashcardIndex); });
        prevCardButton.addEventListener('click', () => { state.currentFlashcardIndex = (state.currentFlashcardIndex - 1 + state.currentFlashcards.length) % state.currentFlashcards.length; loadFlashcard(state.currentFlashcardIndex); });
        nextQuestionButton.addEventListener('click', loadQuizQuestion);
        closeRightSidebar?.addEventListener('click', () => rightSidebar.classList.add('hidden'));
        closeFlashcardsRightSidebar?.addEventListener('click', () => flashcardsRightSidebar.classList.add('hidden'));
        closeQuizRightSidebar?.addEventListener('click', () => quizRightSidebar.classList.add('hidden'));
        chatHistorySearch.addEventListener('input', (e) => renderChatHistory(e.target.value));
        flashcardHistorySearch.addEventListener('input', (e) => renderFlashcardHistory(e.target.value));
        quizHistorySearch.addEventListener('input', (e) => renderQuizHistory(e.target.value));
    }

    function switchView(viewName) {
        [chatView, flashcardsView, quizView].forEach(v => v.classList.add('view-hidden'));
        [rightSidebar, flashcardsRightSidebar, quizRightSidebar].forEach(sb => sb.classList.add('hidden'));
        [chatButton, flashcardsButton, quizButton].forEach(btn => btn.classList.remove('active-nav-button'));

        const activeFileId = state.activeFileId;
        if (viewName === 'chat') {
            chatView.classList.remove('view-hidden');
            rightSidebar.classList.remove('hidden');
            chatButton.classList.add('active-nav-button');
            if (activeFileId) loadChatHistory(activeFileId);
        } else if (viewName === 'flashcards') {
            flashcardsView.classList.remove('view-hidden');
            flashcardsRightSidebar.classList.remove('hidden');
            flashcardsButton.classList.add('active-nav-button');
            if (activeFileId) loadFlashcardHistory(activeFileId);
            loadFlashcard(state.currentFlashcardIndex);
        } else if (viewName === 'quiz') {
            quizView.classList.remove('view-hidden');
            quizRightSidebar.classList.remove('hidden');
            quizButton.classList.add('active-nav-button');
            if (activeFileId) loadQuizHistory(activeFileId);
            loadQuizQuestion();
        }
        localStorage.setItem('activeView', viewName);
    }

    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- Initial Load ---
    async function initializeApp() {
        setupEventListeners();
        await loadFiles();
        const savedView = localStorage.getItem('activeView') || 'chat';
        switchView(savedView);
        safeCreateIcons();
    }

    initializeApp();
});