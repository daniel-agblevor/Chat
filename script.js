document.addEventListener('DOMContentLoaded', () => {
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
    const chatHistoryContainer = document.getElementById('chat-history-container');
    const chatHistoryList = document.getElementById('chat-history-list');
    const chatHistoryLoading = document.getElementById('chat-history-loading');
    const chatHistoryEmpty = document.getElementById('chat-history-empty');
    const chatHistorySearch = document.getElementById('chat-history-search');

    const flashcardsRightSidebar = document.getElementById('flashcards-right-sidebar');
    const flashcardCount = document.getElementById('flashcard-count');
    const generateFlashcardsButton = document.getElementById('generate-flashcards-button');
    const flashcardGenerationLoading = document.getElementById('flashcard-generation-loading');
    const flashcardGenerationSuccess = document.getElementById('flashcard-generation-success');
    const flashcardHistoryList = document.getElementById('flashcard-history-list');
    const flashcardHistorySearch = document.getElementById('flashcard-history-search');

    const quizRightSidebar = document.getElementById('quiz-right-sidebar');
    const quizQuestionCount = document.getElementById('quiz-question-count');
    const generateQuizButton = document.getElementById('generate-quiz-button');
    const quizGenerationLoading = document.getElementById('quiz-generation-loading');
    const quizGenerationSuccess = document.getElementById('quiz-generation-success');
    const quizHistoryList = document.getElementById('quiz-history-list');
    const quizHistorySearch = document.getElementById('quiz-history-search');

    const feedbackModal = document.getElementById('feedback-modal');
    const closeFeedbackModal = document.getElementById('close-feedback-modal');
    const feedbackRating = document.getElementById('feedback-rating');
    const feedbackComments = document.getElementById('feedback-comments');
    const submitFeedbackButton = document.getElementById('submit-feedback-button');
    const feedbackValidation = document.getElementById('feedback-validation');
    const feedbackSuccess = document.getElementById('feedback-success');
    const feedbackButton = document.getElementById('feedback-button');

    const closeRightSidebar = document.getElementById('close-right-sidebar');
    const closeFlashcardsRightSidebar = document.getElementById('close-flashcards-right-sidebar');
    const closeQuizRightSidebar = document.getElementById('close-quiz-right-sidebar');

    if(closeRightSidebar) {
        closeRightSidebar.addEventListener('click', () => {
            rightSidebar.classList.add('hidden');
        });
    }

    if(closeFlashcardsRightSidebar) {
        closeFlashcardsRightSidebar.addEventListener('click', () => {
            flashcardsRightSidebar.classList.add('hidden');
        });
    }

    if(closeQuizRightSidebar) {
        closeQuizRightSidebar.addEventListener('click', () => {
            quizRightSidebar.classList.add('hidden');
        });
    }

    // --- Safe lucide helper ---
    function safeCreateIcons() {
        try {
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
                return;
            }
            if (window.Lucide && typeof window.Lucide.createIcons === 'function') {
                window.Lucide.createIcons();
                return;
            }
        } catch (err) {
            console.warn('lucide.createIcons() threw an error:', err);
        }
    }

    // --- Shared Data ---
    let userFiles = [
        { id: 1, name: 'Q3_Sales_Report.pdf', icon: 'file-pie-chart', color: 'text-violet-400', active: true, history: [
            { sender: 'bot', message: 'Hello! How can I help you with the Q3 Sales Report?' },
            { sender: 'user', message: 'What was the total revenue?' },
            { sender: 'bot', message: 'The total revenue for Q3 was $1.2M.' }
        ], flashcards: [], quizzes: [] },
        { id: 2, name: 'Onboarding_Doc.docx', icon: 'file-text', color: 'text-sky-400', active: false, history: [], flashcards: [], quizzes: [] },
        { id: 3, name: 'user_query.sql', icon: 'file-code-2', color: 'text-indigo-400', active: false, history: [], flashcards: [], quizzes: [] }
    ];

    // --- File Rendering Logic ---
    const sidebarFileList = document.getElementById('sidebar-file-list');
    const manageFilesList = document.getElementById('manage-files-list');

    function renderFiles() {
        sidebarFileList.innerHTML = '';
        manageFilesList.innerHTML = '';
        
        userFiles.forEach(file => {
            const sidebarLi = document.createElement('li');
            sidebarLi.innerHTML = `<a href="#" data-file-id="${file.id}" class="flex items-center gap-3 p-2 rounded-md transition-colors duration-200 ${file.active ? 'bg-slate-800/60 text-slate-100 font-semibold' : 'hover:bg-slate-800/50 text-slate-300'} focus:outline-none focus:ring-2 focus:ring-violet-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${file.icon} h-5 w-5 ${file.color}"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M14.2 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M14.2 14.5v-4.5h4.5"/><path d="M12 22H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8"/></svg>
                <span>${file.name}</span></a>`;
            sidebarFileList.appendChild(sidebarLi);

            const manageLi = document.createElement('li');
            manageLi.className = 'flex items-center justify-between bg-slate-800/50 p-2.5 rounded-lg';
            manageLi.dataset.fileId = file.id;
            manageLi.innerHTML = `
                <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${file.icon} h-5 w-5 ${file.color} flex-shrink-0"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M14.2 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M14.2 14.5v-4.5h4.5"/><path d="M12 22H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8"/></svg>
                    <span class="text-sm text-slate-200 truncate">${file.name}</span>
                </div>
                <button class="delete-file-button p-2 rounded-md text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>`;
            manageFilesList.appendChild(manageLi);
        });
        safeCreateIcons();
    }

    function deleteFile(fileId) {
        const fileName = userFiles.find(f => f.id === fileId)?.name;
        userFiles = userFiles.filter(f => f.id !== fileId);
        if (!userFiles.some(f => f.active) && userFiles.length > 0) {
            userFiles[0].active = true;
        }
        renderFiles();
        const activeFile = userFiles.find(f => f.active);
        if (activeFile) {
            renderChatHistory(activeFile.id);
        }
        showToast(`File "${fileName}" deleted.`, 'success');
    }

    manageFilesList.addEventListener('click', (e) => {
        const deleteButton = e.target.closest('.delete-file-button');
        if (deleteButton) {
            const fileLi = deleteButton.closest('li');
            const fileId = parseInt(fileLi.dataset.fileId);
            deleteFile(fileId);
        }
    });

    sidebarFileList.addEventListener('click', (e) => {
        const fileItem = e.target.closest('a');
        if (fileItem) {
            const fileId = parseInt(fileItem.getAttribute('data-file-id'));
            userFiles.forEach(file => {
                file.active = file.id === fileId;
            });
            renderFiles();
            renderChatHistory(fileId);
        }
    });

    // --- View Switching Logic ---
    function switchView(viewName) {
        [chatView, flashcardsView, quizView].forEach(v => v.classList.add('view-hidden'));

        rightSidebar.classList.add('hidden');
        flashcardsRightSidebar.classList.add('hidden');
        quizRightSidebar.classList.add('hidden');

        // Deactivate all buttons
        chatButton.classList.remove('active-nav-button');
        flashcardsButton.classList.remove('active-nav-button');
        quizButton.classList.remove('active-nav-button');

        // Show the selected view and activate the button
        if (viewName === 'chat') {
            chatView.classList.remove('view-hidden');
            rightSidebar.classList.remove('hidden');
            chatButton.classList.add('active-nav-button');
            const activeFile = userFiles.find(f => f.active);
            if (activeFile) {
                renderChatHistory(activeFile.id);
            }
        } else if (viewName === 'flashcards') {
            flashcardsView.classList.remove('view-hidden');
            flashcardsRightSidebar.classList.remove('hidden');
            flashcardsButton.classList.add('active-nav-button');
            const activeFile = userFiles.find(f => f.active);
            if (activeFile) {
                renderFlashcardHistory(activeFile.id);
            }
            loadFlashcard(0);
        } else if (viewName === 'quiz') {
            quizView.classList.remove('view-hidden');
            quizRightSidebar.classList.remove('hidden');
            quizButton.classList.add('active-nav-button');
            const activeFile = userFiles.find(f => f.active);
            if (activeFile) {
                renderQuizHistory(activeFile.id);
            }
            loadQuizQuestion();
        }
        localStorage.setItem('activeView', viewName);
    }

    // --- Chat History Logic ---
    function renderChatHistory(fileId, searchTerm = '') {
        const file = userFiles.find(f => f.id === fileId);
        chatHistoryList.innerHTML = '';

        if (!file || !file.history || file.history.length === 0) {
            chatHistoryEmpty.classList.remove('hidden');
            chatHistoryLoading.classList.add('hidden');
            return;
        }

        chatHistoryEmpty.classList.add('hidden');
        chatHistoryLoading.classList.add('hidden');

        const filteredHistory = file.history.filter(item => item.message.toLowerCase().includes(searchTerm.toLowerCase()));

        filteredHistory.forEach(item => {
            const li = document.createElement('li');
            li.className = `text-sm p-2 rounded-md ${item.sender === 'user' ? 'bg-slate-700' : 'bg-slate-800'}`;
            li.textContent = item.message;
            chatHistoryList.appendChild(li);
        });
    }

    chatHistorySearch.addEventListener('input', (e) => {
        const activeFile = userFiles.find(f => f.active);
        if (activeFile) {
            renderChatHistory(activeFile.id, e.target.value);
        }
    });

    // --- Flashcard History Logic ---
    function renderFlashcardHistory(fileId, searchTerm = '') {
        const file = userFiles.find(f => f.id === fileId);
        flashcardHistoryList.innerHTML = '';

        if (!file || !file.flashcards || file.flashcards.length === 0) {
            return;
        }

        const filteredFlashcards = file.flashcards.filter(flashcard => flashcard.q.toLowerCase().includes(searchTerm.toLowerCase()));

        filteredFlashcards.forEach(flashcard => {
            const li = document.createElement('li');
            li.className = 'text-sm p-2 rounded-md bg-slate-800';
            li.textContent = flashcard.q;
            flashcardHistoryList.appendChild(li);
        });
    }

    flashcardHistorySearch.addEventListener('input', (e) => {
        const activeFile = userFiles.find(f => f.active);
        if (activeFile) {
            renderFlashcardHistory(activeFile.id, e.target.value);
        }
    });

    generateFlashcardsButton.addEventListener('click', async () => {
        const activeFile = userFiles.find(f => f.active);
        if (!activeFile) {
            showToast('Please select a file first.', 'error');
            return;
        }

        const count = parseInt(flashcardCount.value);
        flashcardGenerationLoading.classList.remove('hidden');
        flashcardGenerationSuccess.classList.add('hidden');

        // Simulate API call
        await new Promise(res => setTimeout(res, 1500));

        const newFlashcards = Array.from({ length: count }, (_, i) => ({
            q: `Generated Question ${i + 1} for ${activeFile.name}`,
            a: `Generated Answer ${i + 1}`
        }));

        activeFile.flashcards = newFlashcards;
        flashcardData.length = 0;
        flashcardData.push(...newFlashcards);

        flashcardGenerationLoading.classList.add('hidden');
        showToast('Flashcards generated successfully!', 'success');

        renderFlashcardHistory(activeFile.id);
        loadFlashcard(0);
    });

    // --- Quiz History Logic ---
    function renderQuizHistory(fileId, searchTerm = '') {
        const file = userFiles.find(f => f.id === fileId);
        quizHistoryList.innerHTML = '';

        if (!file || !file.quizzes || file.quizzes.length === 0) {
            return;
        }

        const filteredQuizzes = file.quizzes.filter(quiz => quiz.q.toLowerCase().includes(searchTerm.toLowerCase()));

        filteredQuizzes.forEach(quiz => {
            const li = document.createElement('li');
            li.className = 'text-sm p-2 rounded-md bg-slate-800';
            li.textContent = quiz.q;
            quizHistoryList.appendChild(li);
        });
    }

    quizHistorySearch.addEventListener('input', (e) => {
        const activeFile = userFiles.find(f => f.active);
        if (activeFile) {
            renderQuizHistory(activeFile.id, e.target.value);
        }
    });

    generateQuizButton.addEventListener('click', async () => {
        const activeFile = userFiles.find(f => f.active);
        if (!activeFile) {
            showToast('Please select a file first.', 'error');
            return;
        }

        const count = parseInt(quizQuestionCount.value);
        quizGenerationLoading.classList.remove('hidden');
        quizGenerationSuccess.classList.add('hidden');

        // Simulate API call
        await new Promise(res => setTimeout(res, 1500));

        const newQuiz = Array.from({ length: count }, (_, i) => ({
            q: `Generated Question ${i + 1} for ${activeFile.name}`,
            options: ['Option 1', 'Option 2', 'Option 3'],
            answer: 'Option 1'
        }));

        activeFile.quizzes = newQuiz;
        quizData.length = 0;
        quizData.push(...newQuiz);

        quizGenerationLoading.classList.add('hidden');
        showToast('Quiz generated successfully!', 'success');

        renderQuizHistory(activeFile.id);
        loadQuizQuestion();
    });

    // --- General UI Controls ---
    function toggleSidebar() {
        sidebar.classList.toggle('-translate-x-full');
        sidebarOverlay.classList.toggle('hidden');
    }
    menuButton.addEventListener('click', (e) => { e.stopPropagation(); toggleSidebar(); });
    sidebarOverlay.addEventListener('click', toggleSidebar);

    chatButton.addEventListener('click', () => switchView('chat'));
    flashcardsButton.addEventListener('click', () => switchView('flashcards'));
    quizButton.addEventListener('click', () => switchView('quiz'));

    openSettingsButton.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettingsModal.addEventListener('click', () => settingsModal.classList.add('hidden'));

    feedbackButton.addEventListener('click', () => {
        feedbackModal.classList.remove('hidden');
    });

    closeFeedbackModal.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
    });

    let selectedRating = 0;
    feedbackRating.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            selectedRating = parseInt(e.target.dataset.rating);
            Array.from(feedbackRating.children).forEach(star => {
                if (parseInt(star.dataset.rating) <= selectedRating) {
                    star.classList.add('text-yellow-400');
                } else {
                    star.classList.remove('text-yellow-400');
                }
            });
        }
    });

    submitFeedbackButton.addEventListener('click', () => {
        if (selectedRating === 0) {
            feedbackValidation.classList.remove('hidden');
            return;
        }
        feedbackValidation.classList.add('hidden');
        showToast('Thank you for your feedback!', 'success');
        setTimeout(() => {
            feedbackModal.classList.add('hidden');
            selectedRating = 0;
            feedbackComments.value = '';
            Array.from(feedbackRating.children).forEach(star => {
                star.classList.remove('text-yellow-400');
            });
        }, 2000);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !feedbackModal.classList.contains('hidden')) {
            feedbackModal.classList.add('hidden');
        }
    });

    // --- Flashcard Logic ---
    const flashcard = document.getElementById('flashcard');
    const flashcardQuestion = document.getElementById('flashcard-question');
    const flashcardAnswer = document.getElementById('flashcard-answer');
    const prevCardButton = document.getElementById('prev-card-button');
    const nextCardButton = document.getElementById('next-card-button');
    const cardCounter = document.getElementById('card-counter');
    
    const flashcardData = [
        { q: 'What is the main purpose of a RAG system?', a: 'To retrieve relevant information from a knowledge base and use it to augment a large language model\'s response.' },
        { q: 'What does "RAG" stand for?', a: 'Retrieval-Augmented Generation.' },
        { q: 'Which component finds the relevant documents?', a: 'The Retriever.' },
        { q: 'What is the role of the "Generator" in RAG?', a: 'To generate a human-like answer based on the prompt and the retrieved context.' }
    ];
    let currentCardIndex = 0;

    function loadFlashcard(index) {
        flashcard.classList.remove('is-flipped');
        setTimeout(() => {
            if (flashcardData.length > 0) {
                flashcardQuestion.textContent = flashcardData[index].q;
                flashcardAnswer.textContent = flashcardData[index].a;
                cardCounter.textContent = `${index + 1} / ${flashcardData.length}`;
            }
        }, 150);
    }

    flashcard.addEventListener('click', () => flashcard.classList.toggle('is-flipped'));
    nextCardButton.addEventListener('click', () => {
        currentCardIndex = (currentCardIndex + 1) % flashcardData.length;
        loadFlashcard(currentCardIndex);
    });
    prevCardButton.addEventListener('click', () => {
        currentCardIndex = (currentCardIndex - 1 + flashcardData.length) % flashcardData.length;
        loadFlashcard(currentCardIndex);
    });
    
    // --- Quiz Logic ---
    const quizQuestionEl = document.getElementById('quiz-question');
    const quizOptionsEl = document.getElementById('quiz-options');
    const quizFeedbackEl = document.getElementById('quiz-feedback');
    const nextQuestionButton = document.getElementById('next-question-button');
    const progressText = document.getElementById('quiz-progress-text');
    const progressBar = document.getElementById('quiz-progress-bar');
    
    const quizData = [
        { q: 'What does CSS stand for?', options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets'], answer: 'Cascading Style Sheets' },
        { q: 'Which HTML tag is used to define an internal style sheet?', options: ['<style>', '<css>', '<script>'], answer: '<style>' },
        { q: 'What is the correct CSS syntax?', options: ['body {color: black;}', '{body;color:black;}', 'body:color=black;'], answer: 'body {color: black;}' },
        { q: 'How do you add a background color for all <h1> elements?', options: ['h1 {background-color:#FFFFFF;}', 'all.h1 {background-color:#FFFFFF;}', 'h1.all {background-color:#FFFFFF;}'], answer: 'h1 {background-color:#FFFFFF;}' }
    ];
    let currentQuizIndex = 0;
    let score = 0;

    function loadQuizQuestion() {
        quizFeedbackEl.textContent = '';
        quizOptionsEl.innerHTML = '';
        nextQuestionButton.classList.add('hidden');
        Array.from(quizOptionsEl.children).forEach(btn => btn.disabled = false);

        if (currentQuizIndex >= quizData.length) {
            quizQuestionEl.textContent = `Quiz Complete! You scored ${score} out of ${quizData.length}.`;
            progressText.textContent = 'Finished!';
            progressBar.style.width = '100%';
            return;
        }

        const question = quizData[currentQuizIndex];
        progressText.textContent = `Question ${currentQuizIndex + 1} of ${quizData.length}`;
        progressBar.style.width = `${((currentQuizIndex + 1) / quizData.length) * 100}%`;
        quizQuestionEl.textContent = question.q;
        
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'text-left p-4 bg-slate-800/60 hover:bg-violet-600/50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500';
            button.onclick = () => selectQuizAnswer(button, option, question.answer);
            quizOptionsEl.appendChild(button);
        });
    }

    function selectQuizAnswer(button, selected, correct) {
        Array.from(quizOptionsEl.children).forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('hover:bg-violet-600/50');
        });
        
        if (selected === correct) {
            button.classList.add('bg-green-500/80');
            quizFeedbackEl.textContent = 'Correct!';
            quizFeedbackEl.className = 'text-center mb-4 min-h-[24px] text-green-400 font-semibold';
            score++;
        } else {
            button.classList.add('bg-red-500/80');
            quizFeedbackEl.textContent = `Incorrect. The correct answer is "${correct}"`;
            quizFeedbackEl.className = 'text-center mb-4 min-h-[24px] text-red-400 font-semibold';
             Array.from(quizOptionsEl.children).forEach(btn => {
                if (btn.textContent === correct) {
                     btn.classList.add('bg-green-500/80');
                }
            });
        }
        currentQuizIndex++;
        nextQuestionButton.classList.remove('hidden');
    }
    
    nextQuestionButton.addEventListener('click', loadQuizQuestion);

    // --- Chat Message Logic ---
    function addMessage(message, sender = 'bot') {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-fade-in');
        if (sender === 'user') {
            messageElement.className = 'flex items-start gap-2.5 sm:gap-3 justify-end message-fade-in';
            messageElement.innerHTML = `<div class="bg-violet-600 rounded-2xl rounded-br-none p-3 sm:p-4 max-w-[80%] sm:max-w-md"><p class="text-white break-words">${message}</p></div><div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-700 flex items-center justify-center"><svg class="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`;
        } else {
            messageElement.className = 'flex items-start gap-2.5 sm:gap-3 message-fade-in';
            messageElement.innerHTML = `<div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-500/20 flex items-center justify-center"><svg class="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></div><div class="bg-slate-800/50 rounded-2xl rounded-tl-none p-3 sm:p-4 max-w-[80%] sm:max-w-md"><p class="text-slate-200 break-words">${message}</p></div>`;
        }
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        const activeFile = userFiles.find(f => f.active);
        if (activeFile) {
            activeFile.history.push({ sender, message });
            renderChatHistory(activeFile.id);
        }
    }

    async function fetchRagResponse(message) {
        typingIndicator.classList.remove('hidden');
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return new Promise(resolve => {
            setTimeout(() => {
                let response = "I am a demo RAG system. I don't have access to a live database, but if I did, I could answer your questions about it.";
                const lowerCaseMessage = message.toLowerCase();
                if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) { response = "Hello there! How can I assist you today?"; } 
                else if (lowerCaseMessage.includes("sales report")) { response = "Accessing sales data... The quarterly sales report shows a 15% increase in revenue, primarily driven by the new product line in the APAC region."; }
                else if (lowerCaseMessage.includes("customer satisfaction")) { response = "According to recent surveys, customer satisfaction is at 88%, with the highest scores in product reliability and customer support."; }
                else if (lowerCaseMessage.includes("thank you") || lowerCaseMessage.includes("thanks")) { response = "You're welcome! Is there anything else I can help you with?"; }
                typingIndicator.classList.add('hidden');
                resolve(response);
            }, 1500 + Math.random() * 500);
        });
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = messageInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, 'user');
            messageInput.value = '';
            const botResponse = await fetchRagResponse(userMessage);
            addMessage(botResponse, 'bot');
        }
    });

    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // --- Initial Load ---
    renderFiles();
    loadFlashcard(0);
    safeCreateIcons();
    const savedView = localStorage.getItem('activeView');
    if (savedView) {
        switchView(savedView);
    } else {
        switchView('chat'); // Set initial view to chat
    }
});
