// Application State
let currentQuiz = {
    questions: [],
    currentIndex: 0,
    answers: [],
    feedbackMode: 'immediate',
    startTime: null
};

let isLoggedIn = false;
let quizTimerInterval = null;

// DOM Elements
const sections = {
    dashboard: document.getElementById('dashboard'),
    quizConfig: document.getElementById('quiz-config'),
    quiz: document.getElementById('quiz'),
    quizResults: document.getElementById('quiz-results'),
    history: document.getElementById('history'),
    admin: document.getElementById('admin')
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboardData();
});

// Initialize Application
function initializeApp() {
    // Show dashboard by default
    showSection('dashboard');
    
    // Setup navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.closest('.nav-btn').dataset.section;
            navigateToSection(section);
        });
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Quick action buttons on dashboard
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', handleQuickAction);
    });
    
    // Quiz configuration
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    document.getElementById('question-count').addEventListener('input', updateMaxQuestions);
    
    // Question type filter change
    document.querySelectorAll('input[name="question-type-filter"]').forEach(radio => {
        radio.addEventListener('change', updateQuestionTypeFilter);
    });
    
    // Quiz actions
    document.getElementById('submit-answer').addEventListener('click', submitAnswer);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    document.getElementById('finish-quiz').addEventListener('click', finishQuiz);
    
    // Quiz results actions
    document.querySelector('[data-action="start-new-quiz"]').addEventListener('click', () => navigateToSection('quiz-config'));
    document.querySelector('[data-action="view-details"]').addEventListener('click', toggleResultsDetails);
    
    // Admin login
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.querySelector('.admin-logout').addEventListener('click', handleLogout);
    
    // Admin navigation
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!e.target.classList.contains('admin-logout')) {
                const section = e.target.dataset.adminSection;
                showAdminSection(section);
            }
        });
    });
    
    // Question form
    document.getElementById('question-form').addEventListener('submit', handleQuestionSubmit);
    document.getElementById('question-type').addEventListener('change', handleQuestionTypeChange);
    document.getElementById('add-option').addEventListener('click', addOption);
    document.getElementById('cancel-edit').addEventListener('click', cancelEdit);
    
    // Rich editor
    setupRichEditor();
    
    // Numbering type change
    document.querySelectorAll('input[name="numbering-type"]').forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });
    
    // Back buttons
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.closest('.btn-back').dataset.section;
            navigateToSection(section);
        });
    });
}

// Navigation Functions
function navigateToSection(sectionName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionName);
    });
    
    // Show section
    showSection(sectionName);
    
    // Load section data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'quiz-config':
            loadQuizConfig();
            break;
        case 'history':
            loadHistory();
            break;
        case 'admin':
            if (!isLoggedIn) {
                showElement('admin-login');
                hideElement('admin-panel');
            }
            break;
    }
}

function showSection(sectionName) {
    // Stop quiz timer when leaving quiz section
    if (quizTimerInterval && sectionName !== 'quiz') {
        stopQuizTimer();
    }
    
    // Hide all sections
    Object.values(sections).forEach(section => {
        if (section) section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = sections[sectionName] || document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        showLoading();
        const stats = await fetchAPI('/api/stats');
        updateDashboardStats(stats);
        
        // Check if there are questions
        if (stats.totalQuestions === 0) {
            showElement('no-questions-message');
            hideElement('quick-actions');
        } else {
            hideElement('no-questions-message');
            showElement('quick-actions');
        }
    } catch (error) {
        showToast('Erro ao carregar dados do dashboard', 'error');
        console.error('Error loading dashboard:', error);
    } finally {
        hideLoading();
    }
}

function updateDashboardStats(stats) {
    document.getElementById('total-questions').textContent = stats.totalQuestions;
    document.getElementById('total-sessions').textContent = stats.totalSessions;
    document.getElementById('average-score').textContent = stats.averageScore + '%';
    document.getElementById('total-correct').textContent = stats.totalCorrect;
}

function handleQuickAction(e) {
    const action = e.target.closest('[data-action]').dataset.action;
    
    switch(action) {
        case 'start-quiz':
            navigateToSection('quiz-config');
            break;
        case 'view-history':
            navigateToSection('history');
            break;
        case 'manage-questions':
            navigateToSection('admin');
            break;
        case 'start-new-quiz':
            navigateToSection('quiz-config');
            break;
    }
}

// Quiz Configuration Functions
async function loadQuizConfig() {
    try {
        const questions = await fetchAPI('/api/questions');
        
        // Count questions by type
        const multipleChoiceCount = questions.filter(q => q.type === 'multiple-choice').length;
        const essayCount = questions.filter(q => q.type === 'essay').length;
        const totalQuestions = questions.length;
        
        // Update counters
        document.querySelector('#multiple-choice-count .count').textContent = multipleChoiceCount;
        document.querySelector('#essay-count .count').textContent = essayCount;
        
        // Auto-select appropriate filter based on available questions
        if (essayCount === 0 && multipleChoiceCount > 0) {
            // Only multiple choice available
            document.querySelector('input[name="question-type-filter"][value="multiple-choice"]').checked = true;
            document.querySelector('input[name="question-type-filter"][value="essay"]').disabled = true;
            document.querySelector('input[name="question-type-filter"][value="mixed"]').disabled = true;
        } else if (multipleChoiceCount === 0 && essayCount > 0) {
            // Only essay available
            document.querySelector('input[name="question-type-filter"][value="essay"]').checked = true;
            document.querySelector('input[name="question-type-filter"][value="multiple-choice"]').disabled = true;
            document.querySelector('input[name="question-type-filter"][value="mixed"]').disabled = true;
        } else if (multipleChoiceCount > 0 && essayCount > 0) {
            // Both types available - default to multiple choice only
            document.querySelector('input[name="question-type-filter"][value="multiple-choice"]').checked = true;
            document.querySelector('input[name="question-type-filter"][value="essay"]').disabled = false;
            document.querySelector('input[name="question-type-filter"][value="mixed"]').disabled = false;
        } else {
            // No questions available
            document.querySelectorAll('input[name="question-type-filter"]').forEach(radio => {
                radio.disabled = true;
            });
        }
        
        // Update max questions based on filter
        updateQuestionTypeFilter();
        
        if (totalQuestions === 0) {
            document.getElementById('start-quiz-btn').disabled = true;
            showToast('Nenhuma questão disponível. Cadastre questões primeiro.', 'warning');
        } else {
            document.getElementById('start-quiz-btn').disabled = false;
        }
    } catch (error) {
        showToast('Erro ao carregar configurações do quiz', 'error');
        console.error('Error loading quiz config:', error);
    }
}

function updateMaxQuestions(e) {
    const value = parseInt(e.target.value);
    const max = parseInt(e.target.max);
    
    if (value > max) {
        e.target.value = max;
        showToast(`Máximo de ${max} questões disponíveis`, 'warning');
    }
}

async function updateQuestionTypeFilter() {
    try {
        const questions = await fetchAPI('/api/questions');
        const selectedFilter = document.querySelector('input[name="question-type-filter"]:checked').value;
        
        let filteredQuestions = [];
        let filterDescription = '';
        
        switch(selectedFilter) {
            case 'multiple-choice':
                filteredQuestions = questions.filter(q => q.type === 'multiple-choice');
                filterDescription = 'múltipla escolha';
                break;
            case 'essay':
                filteredQuestions = questions.filter(q => q.type === 'essay');
                filterDescription = 'discursivas';
                break;
            case 'mixed':
                filteredQuestions = questions;
                filterDescription = 'mistas';
                break;
        }
        
        const maxQuestions = filteredQuestions.length;
        const questionCountInput = document.getElementById('question-count');
        const maxQuestionsInfo = document.getElementById('max-questions-info');
        
        questionCountInput.max = maxQuestions;
        maxQuestionsInfo.textContent = `Máximo: ${maxQuestions} questões ${filterDescription} disponíveis`;
        
        // Adjust current value if necessary
        if (parseInt(questionCountInput.value) > maxQuestions) {
            questionCountInput.value = maxQuestions;
        }
        
        // Set default value if empty
        if (!questionCountInput.value || parseInt(questionCountInput.value) === 0) {
            questionCountInput.value = Math.min(10, maxQuestions);
        }
        
        // Enable/disable start button
        document.getElementById('start-quiz-btn').disabled = maxQuestions === 0;
        
        if (maxQuestions === 0) {
            showToast(`Nenhuma questão ${filterDescription} disponível`, 'warning');
        }
        
    } catch (error) {
        console.error('Error updating question type filter:', error);
    }
}

async function startQuiz() {
    try {
        showLoading();
        
        const questionCount = parseInt(document.getElementById('question-count').value);
        const feedbackMode = document.querySelector('input[name="feedback-mode"]:checked').value;
        const questionTypeFilter = document.querySelector('input[name="question-type-filter"]:checked').value;
        
        const questions = await fetchAPI(`/api/quiz/${questionCount}?type=${questionTypeFilter}`);
        
        if (questions.length === 0) {
            showToast('Nenhuma questão disponível para o filtro selecionado', 'error');
            return;
        }
        
        // Initialize quiz state
        currentQuiz = {
            questions: questions,
            currentIndex: 0,
            answers: [],
            feedbackMode: feedbackMode,
            questionTypeFilter: questionTypeFilter,
            startTime: new Date()
        };
        
        showSection('quiz');
        displayCurrentQuestion();
        updateQuizProgress();
        startQuizTimer();
        
    } catch (error) {
        showToast('Erro ao iniciar quiz', 'error');
        console.error('Error starting quiz:', error);
    } finally {
        hideLoading();
    }
}

// Quiz Functions
function displayCurrentQuestion() {
    const question = currentQuiz.questions[currentQuiz.currentIndex];
    
    document.getElementById('question-text').innerHTML = question.question;
    
    // Clear previous content
    document.getElementById('question-options').innerHTML = '';
    document.getElementById('question-input').style.display = 'none';
    document.getElementById('feedback').style.display = 'none';
    
    // Show appropriate input type
    if (question.type === 'multiple-choice') {
        displayMultipleChoiceOptions(question.options, question.numberingType || 'numbers');
    } else {
        displayEssayInput();
    }
    
    // Reset buttons
    document.getElementById('submit-answer').style.display = 'inline-flex';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('finish-quiz').style.display = 'none';
}

function displayMultipleChoiceOptions(options, numberingType = 'numbers') {
    const container = document.getElementById('question-options');
    
    options.forEach((option, index) => {
        const optionNumber = numberingType === 'letters' ? 
            String.fromCharCode(97 + index) : (index + 1).toString();
            
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.innerHTML = `
            <input type="radio" name="quiz-answer" value="${option}" id="option-${index}">
            <div class="option-custom"></div>
            <div class="option-number-quiz">${optionNumber}</div>
            <label for="option-${index}" class="option-text">${option}</label>
        `;
        
        optionDiv.addEventListener('click', () => {
            // Remove previous selections
            container.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            optionDiv.classList.add('selected');
            optionDiv.querySelector('input').checked = true;
        });
        
        container.appendChild(optionDiv);
    });
}

function displayEssayInput() {
    document.getElementById('question-input').style.display = 'block';
    document.getElementById('user-answer').value = '';
    document.getElementById('user-answer').focus();
}

function updateQuizProgress() {
    const current = currentQuiz.currentIndex + 1;
    const total = currentQuiz.questions.length;
    const percentage = (current / total) * 100;
    
    document.getElementById('question-counter').textContent = `Questão ${current} de ${total}`;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
}

async function submitAnswer() {
    const question = currentQuiz.questions[currentQuiz.currentIndex];
    let userAnswer = '';
    
    // Get user answer
    if (question.type === 'multiple-choice') {
        const selected = document.querySelector('input[name="quiz-answer"]:checked');
        if (!selected) {
            showToast('Por favor, selecione uma resposta', 'warning');
            return;
        }
        userAnswer = selected.value;
    } else {
        userAnswer = document.getElementById('user-answer').value.trim();
        if (!userAnswer) {
            showToast('Por favor, digite uma resposta', 'warning');
            return;
        }
    }
    
    try {
        // Check answer with backend
        const result = await fetchAPI('/api/quiz/check', {
            method: 'POST',
            body: JSON.stringify({
                questionId: question.id,
                userAnswer: userAnswer
            })
        });
        
        // Store answer
        currentQuiz.answers.push({
            questionId: question.id,
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: result.correctAnswer,
            isCorrect: result.correct,
            explanation: result.explanation
        });
        
        // Show feedback if immediate mode
        if (currentQuiz.feedbackMode === 'immediate') {
            showFeedback(result);
        }
        
        // Update buttons
        document.getElementById('submit-answer').style.display = 'none';
        
        if (currentQuiz.currentIndex < currentQuiz.questions.length - 1) {
            document.getElementById('next-question').style.display = 'inline-flex';
        } else {
            document.getElementById('finish-quiz').style.display = 'inline-flex';
        }
        
    } catch (error) {
        showToast('Erro ao verificar resposta', 'error');
        console.error('Error checking answer:', error);
    }
}

function showFeedback(result) {
    const feedback = document.getElementById('feedback');
    const icon = feedback.querySelector('.feedback-icon');
    const text = feedback.querySelector('.feedback-text');
    const explanation = feedback.querySelector('.feedback-explanation');
    
    feedback.style.display = 'block';
    feedback.className = `feedback ${result.correct ? 'correct' : 'incorrect'}`;
    
    if (result.correct) {
        icon.className = 'feedback-icon fas fa-check-circle';
        text.textContent = 'Correto!';
    } else {
        icon.className = 'feedback-icon fas fa-times-circle';
        text.textContent = `Incorreto. A resposta correta é: ${result.correctAnswer}`;
    }
    
    if (result.explanation) {
        explanation.style.display = 'block';
        explanation.querySelector('.explanation-text').textContent = result.explanation;
    } else {
        explanation.style.display = 'none';
    }
}

function nextQuestion() {
    currentQuiz.currentIndex++;
    displayCurrentQuestion();
    updateQuizProgress();
}

async function finishQuiz() {
    try {
        showLoading();
        
        // Stop the timer
        stopQuizTimer();
        
        // Calculate results
        const correctAnswers = currentQuiz.answers.filter(a => a.isCorrect).length;
        const wrongAnswers = currentQuiz.answers.length - correctAnswers;
        const score = Math.round((correctAnswers / currentQuiz.answers.length) * 100);
        
        // Save to history
        const sessionData = {
            totalQuestions: currentQuiz.answers.length,
            correctAnswers: correctAnswers,
            wrongAnswers: wrongAnswers,
            questions: currentQuiz.answers,
            feedbackMode: currentQuiz.feedbackMode,
            duration: Math.round((new Date() - currentQuiz.startTime) / 1000) // in seconds
        };
        
        await fetchAPI('/api/history', {
            method: 'POST',
            body: JSON.stringify(sessionData)
        });
        
        // Show results
        displayQuizResults(sessionData);
        showSection('quiz-results');
        
    } catch (error) {
        showToast('Erro ao finalizar quiz', 'error');
        console.error('Error finishing quiz:', error);
    } finally {
        hideLoading();
    }
}

function displayQuizResults(results) {
    document.getElementById('final-score').textContent = results.correctAnswers > 0 ? 
        Math.round((results.correctAnswers / results.totalQuestions) * 100) + '%' : '0%';
    document.getElementById('correct-count').textContent = results.correctAnswers;
    document.getElementById('wrong-count').textContent = results.wrongAnswers;
    document.getElementById('total-count').textContent = results.totalQuestions;
    document.getElementById('total-time').textContent = formatTime(results.duration || 0);
    
    // Populate detailed results
    const detailsContainer = document.getElementById('detailed-results');
    detailsContainer.innerHTML = '';
    
    results.questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        // Cria um identificador único para essa questão
        const questionContentId = `quiz-result-content-${index}`;
        
        questionDiv.innerHTML = `
            <div class="question-header" data-question-id="${index}">
                <div class="question-number"><strong>Questão ${index + 1}</strong></div>
                <div class="question-preview">${truncateText(q.question, 50)}</div>
                <div class="question-status">${q.isCorrect ? '✅' : '❌'}</div>
                <div class="question-toggle"><i class="fas fa-chevron-down"></i></div>
            </div>
            <div class="question-content" id="${questionContentId}" style="display:none;">
                <div class="question-text">
                    <strong>Pergunta:</strong> ${q.question}
                </div>
                <div class="question-answer">
                    <strong>Sua resposta:</strong> ${q.userAnswer}
                </div>
                <div class="question-correct">
                    <strong>Resposta correta:</strong> ${q.correctAnswer}
                </div>
                ${q.explanation ? `
                <div class="question-explanation">
                    <strong>Explicação:</strong> ${q.explanation}
                </div>
                ` : ''}
            </div>
        `;
        
        detailsContainer.appendChild(questionDiv);
        
        // Adiciona event listener para expansão/colapso
        const header = questionDiv.querySelector('.question-header');
        header.addEventListener('click', (event) => {
            // Impede que o evento seja propagado para elementos pais
            event.stopPropagation();
            
            const content = document.getElementById(questionContentId);
            const icon = header.querySelector('.question-toggle i');
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.className = 'fas fa-chevron-up';
            } else {
                content.style.display = 'none';
                icon.className = 'fas fa-chevron-down';
            }
        });
    });
}

function toggleResultsDetails() {
    const details = document.getElementById('results-details');
    const button = document.querySelector('[data-action="view-details"]');
    
    if (details.style.display === 'none' || !details.style.display) {
        details.style.display = 'block';
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Detalhes';
    } else {
        details.style.display = 'none';
        button.innerHTML = '<i class="fas fa-list"></i> Ver Detalhes';
    }
}

// History Functions
async function loadHistory() {
    try {
        showElement('history-loading');
        hideElement('history-list');
        hideElement('no-history');
        
        const history = await fetchAPI('/api/history');
        
        if (history.length === 0) {
            hideElement('history-loading');
            showElement('no-history');
            return;
        }
        
        displayHistory(history);
        hideElement('history-loading');
        showElement('history-list');
        
    } catch (error) {
        hideElement('history-loading');
        showToast('Erro ao carregar histórico', 'error');
        console.error('Error loading history:', error);
    }
}

function displayHistory(history) {
    const container = document.getElementById('history-list');
    container.innerHTML = '';
    
    // Sort by date (newest first)
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    history.forEach((session, index) => {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'history-item';
        
        const date = new Date(session.date).toLocaleString('pt-BR');
        const score = Math.round((session.correctAnswers / session.totalQuestions) * 100);
        
        sessionDiv.innerHTML = `
            <div class="history-clickable-area">
                <div class="history-header">
                    <div class="history-title">Sessão ${history.length - index}</div>
                    <div class="history-date">${date}</div>
                </div>
                <div class="history-stats">
                    <span><i class="fas fa-question-circle"></i> ${session.totalQuestions} questões</span>
                    <span><i class="fas fa-check-circle text-success"></i> ${session.correctAnswers} corretas</span>
                    <span><i class="fas fa-times-circle text-error"></i> ${session.wrongAnswers} erradas</span>
                    <span><i class="fas fa-percentage"></i> ${score}%</span>
                </div>
                <div class="history-toggle">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
            <div class="history-details" style="display: none;">
                <div id="session-details-${session.id}"></div>
            </div>
        `;
        
        // Adicionar evento apenas na área clicável
        const clickableArea = sessionDiv.querySelector('.history-clickable-area');
        clickableArea.addEventListener('click', () => toggleSessionDetails(session, sessionDiv));
        
        container.appendChild(sessionDiv);
    });
}

function toggleSessionDetails(session, element) {
    const details = element.querySelector('.history-details');
    const detailsContainer = element.querySelector(`#session-details-${session.id}`);
    const toggleIcon = element.querySelector('.history-toggle i');
    
    if (details.style.display === 'none') {
        // Show details
        details.style.display = 'block';
        toggleIcon.className = 'fas fa-chevron-up';
        
        if (!detailsContainer.innerHTML) {
            // Load details if not already loaded
            detailsContainer.innerHTML = session.questions.map((q, index) => `
                <div class="question-item">
                    <div class="question-header" data-question-id="${index}">
                        <div class="question-number"><strong>Questão ${index + 1}</strong></div>
                        <div class="question-preview">${truncateText(q.question, 50)}</div>
                        <div class="question-status">${q.isCorrect ? '✅' : '❌'}</div>
                        <div class="question-toggle"><i class="fas fa-chevron-down"></i></div>
                    </div>
                    <div class="question-content" id="question-content-${session.id}-${index}" style="display:none;">
                        <div class="question-text">
                            <strong>Pergunta:</strong> ${q.question}
                        </div>
                        <div class="question-answer">
                            <strong>Sua resposta:</strong> ${q.userAnswer}
                        </div>
                        <div class="question-correct">
                            <strong>Resposta correta:</strong> ${q.correctAnswer}
                        </div>
                        ${q.explanation ? `
                        <div class="question-explanation">
                            <strong>Explicação:</strong> ${q.explanation}
                        </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
            
            // Adicionar listeners para os cabeçalhos das questões
            detailsContainer.querySelectorAll('.question-header').forEach(header => {
                header.addEventListener('click', (event) => {
                    // Impede que o evento seja propagado para elementos pais
                    event.stopPropagation();
                    
                    const questionId = header.getAttribute('data-question-id');
                    const content = document.getElementById(`question-content-${session.id}-${questionId}`);
                    const icon = header.querySelector('.question-toggle i');
                    
                    if (content.style.display === 'none') {
                        content.style.display = 'block';
                        icon.className = 'fas fa-chevron-up';
                    } else {
                        content.style.display = 'none';
                        icon.className = 'fas fa-chevron-down';
                    }
                });
            });
        }
        // já configurado acima
    } else {
        details.style.display = 'none';
        toggleIcon.className = 'fas fa-chevron-down';
    }
}

// Função auxiliar para truncar texto
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Admin Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    try {
        showLoading();
        
        const result = await fetchAPI('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        isLoggedIn = true;
        hideElement('admin-login');
        showElement('admin-panel');
        showAdminSection('questions');
        loadQuestions();
        
        showToast('Login realizado com sucesso!', 'success');
        
    } catch (error) {
        showToast('Credenciais inválidas', 'error');
        console.error('Login error:', error);
    } finally {
        hideLoading();
    }
}

function handleLogout() {
    isLoggedIn = false;
    showElement('admin-login');
    hideElement('admin-panel');
    document.getElementById('login-form').reset();
    showToast('Logout realizado com sucesso!', 'info');
}

function showAdminSection(sectionName) {
    // Update nav buttons
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.adminSection === sectionName);
    });
    
    // Show section
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`admin-${sectionName}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Load section data
    if (sectionName === 'questions') {
        loadQuestions();
    }
}

async function loadQuestions() {
    try {
        const questions = await fetchAPI('/api/questions');
        displayQuestions(questions);
    } catch (error) {
        showToast('Erro ao carregar questões', 'error');
        console.error('Error loading questions:', error);
    }
}

function displayQuestions(questions) {
    const container = document.getElementById('questions-list');
    container.innerHTML = '';
    
    if (questions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-question-circle"></i>
                <h3>Nenhuma questão cadastrada</h3>
                <p>Clique em "Adicionar Questão" para começar.</p>
            </div>
        `;
        return;
    }
    
    questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        
        const typeLabel = question.type === 'multiple-choice' ? 'Múltipla Escolha' : 'Discursiva';
        
        // Create a preview of the question with proper formatting
        const questionPreview = document.createElement('div');
        questionPreview.innerHTML = question.question;
        const questionText = questionPreview.textContent || questionPreview.innerText || '';
        const truncatedText = questionText.length > 100 ? questionText.substring(0, 100) + '...' : questionText;
        
        questionDiv.innerHTML = `
            <div class="question-header">
                <div class="question-info">
                    <h4>${truncatedText}</h4>
                    <span class="question-type">${typeLabel}</span>
                </div>
                <div class="question-actions">
                    <button class="btn btn-small btn-outline" onclick="editQuestion(${question.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-small" style="background: var(--error-color);" onclick="deleteQuestion(${question.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
            <div class="question-content">
                <div class="question-full-text">
                    ${question.question}
                </div>
                ${question.options ? `
                    <strong>Opções${question.numberingType === 'letters' ? ' (a, b, c...)' : ' (1, 2, 3...)'}:</strong>
                    <div class="question-options-display">
                        ${question.options.map((opt, index) => {
                            const number = question.numberingType === 'letters' ? 
                                String.fromCharCode(97 + index) : (index + 1).toString();
                            const isCorrect = opt === question.correctAnswer;
                            return `<div class="option-display ${isCorrect ? 'correct-option' : ''}">
                                <span class="option-number-display">${number}</span>
                                <span class="option-text-display">${opt}</span>
                                ${isCorrect ? '<i class="fas fa-check-circle text-success"></i>' : ''}
                            </div>`;
                        }).join('')}
                    </div>
                ` : `
                    <div class="question-correct-answer">
                        <strong>Resposta modelo:</strong> ${question.correctAnswer}
                    </div>
                `}
                ${question.explanation ? `
                    <div style="margin-top: 0.5rem;">
                        <strong>Explicação:</strong> ${question.explanation}
                    </div>
                ` : ''}
            </div>
        `;
        
        container.appendChild(questionDiv);
    });
}

function handleQuestionTypeChange(e) {
    const type = e.target.value;
    const optionsContainer = document.getElementById('options-container');
    const previewContainer = document.getElementById('question-preview');
    
    if (type === 'multiple-choice') {
        optionsContainer.style.display = 'block';
        previewContainer.style.display = 'block';
        
        // Add default options if none exist
        if (document.getElementById('options-list').children.length === 0) {
            addOption();
            addOption();
        }
    } else {
        optionsContainer.style.display = 'none';
        previewContainer.style.display = 'none';
    }
    
    // Ensure correct answer field exists for the type
    ensureCorrectAnswerField();
    
    updatePreview();
}

function addOption() {
    const optionsList = document.getElementById('options-list');
    const optionIndex = optionsList.children.length;
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-input';
    
    const numberingType = document.querySelector('input[name="numbering-type"]:checked').value;
    const optionNumber = getOptionNumber(optionIndex, numberingType);
    
    optionDiv.innerHTML = `
        <div class="option-number">${optionNumber}</div>
        <input type="text" placeholder="Digite uma opção..." required oninput="updatePreview()">
        <div class="option-correct">
            <input type="checkbox" id="correct-${optionIndex}" name="correct-option" value="${optionIndex}" onchange="handleCorrectOptionChange(this)">
            <label for="correct-${optionIndex}">Correta</label>
        </div>
        <button type="button" class="remove-option" onclick="removeOption(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    optionsList.appendChild(optionDiv);
    updatePreview();
}

function removeOption(button) {
    const optionDiv = button.parentElement;
    optionDiv.remove();
    updateOptionNumbers();
    updatePreview();
}

async function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const questionId = formData.get('questionId');
    const questionData = getFormQuestionData();
    
    // Validation
    if (!questionData.question.trim()) {
        showToast('O enunciado da questão é obrigatório', 'warning');
        return;
    }
    
    if (questionData.type === 'multiple-choice') {
        if (!questionData.options || questionData.options.length < 2) {
            showToast('Questões de múltipla escolha precisam ter pelo menos 2 opções', 'warning');
            return;
        }
        
        if (!questionData.correctAnswer) {
            showToast('Marque qual é a resposta correta', 'warning');
            return;
        }
    } else {
        if (!questionData.correctAnswer.trim()) {
            showToast('A resposta correta é obrigatória', 'warning');
            return;
        }
    }
    
    try {
        showLoading();
        
        let result;
        if (questionId) {
            // Update existing question
            result = await fetchAPI(`/api/questions/${questionId}`, {
                method: 'PUT',
                body: JSON.stringify(questionData)
            });
        } else {
            // Create new question
            result = await fetchAPI('/api/questions', {
                method: 'POST',
                body: JSON.stringify(questionData)
            });
        }
        
        showToast(questionId ? 'Questão atualizada com sucesso!' : 'Questão criada com sucesso!', 'success');
        
        // Reset form and go back to questions list
        document.getElementById('question-form').reset();
        cancelEdit();
        showAdminSection('questions');
        
    } catch (error) {
        showToast('Erro ao salvar questão', 'error');
        console.error('Error saving question:', error);
    } finally {
        hideLoading();
    }
}

async function editQuestion(id) {
    try {
        const question = await fetchAPI(`/api/questions/${id}`);
        
        // Fill the existing add question form with question data
        document.getElementById('question-id').value = question.id;
        document.getElementById('question-type').value = question.type;
        document.getElementById('question-content').innerHTML = question.question;
        document.getElementById('question-content-html').value = question.question;
        document.getElementById('explanation').value = question.explanation || '';
        
        // Handle options for multiple choice
        if (question.type === 'multiple-choice' && question.options) {
            // Set numbering type
            if (question.numberingType) {
                document.querySelector(`input[name="numbering-type"][value="${question.numberingType}"]`).checked = true;
            }
            
            const optionsList = document.getElementById('options-list');
            optionsList.innerHTML = '';
            
            question.options.forEach((option, index) => {
                addOption();
                const optionInputs = optionsList.querySelectorAll('.option-input');
                const lastOptionDiv = optionInputs[optionInputs.length - 1];
                const textInput = lastOptionDiv.querySelector('input[type="text"]');
                const checkbox = lastOptionDiv.querySelector('input[type="checkbox"]');
                
                textInput.value = option;
                
                // Check if this is the correct answer
                if (option === question.correctAnswer) {
                    checkbox.checked = true;
                }
            });
        } else {
            // For essay questions, show the correct answer field
            const correctAnswerField = document.createElement('div');
            correctAnswerField.className = 'form-group';
            correctAnswerField.innerHTML = `
                <label for="correct-answer">Resposta Correta:</label>
                <textarea id="correct-answer" name="correctAnswer" rows="3" required placeholder="Digite a resposta modelo...">${question.correctAnswer || ''}</textarea>
            `;
            
            // Insert before explanation field
            const explanationField = document.querySelector('#explanation').closest('.form-group');
            explanationField.parentNode.insertBefore(correctAnswerField, explanationField);
        }
        
        // Update form UI
        handleQuestionTypeChange({ target: { value: question.type } });
        document.getElementById('form-title').textContent = 'Editar Questão';
        document.getElementById('submit-btn-text').textContent = 'Atualizar Questão';
        document.getElementById('cancel-edit').style.display = 'inline-flex';
        
        // Update preview
        updatePreview();
        
        // Switch to add question section (reusing the existing form)
        showAdminSection('add-question');
        
    } catch (error) {
        showToast('Erro ao carregar questão para edição', 'error');
        console.error('Error loading question for edit:', error);
    }
}

async function deleteQuestion(id) {
    if (!confirm('Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        showLoading();
        
        await fetchAPI(`/api/questions/${id}`, {
            method: 'DELETE'
        });
        
        showToast('Questão excluída com sucesso!', 'success');
        loadQuestions();
        
    } catch (error) {
        showToast('Erro ao excluir questão', 'error');
        console.error('Error deleting question:', error);
    } finally {
        hideLoading();
    }
}







async function clearHistory() {
    const confirmed = confirm('Tem certeza que deseja limpar todo o histórico de testes? Esta ação não pode ser desfeita.');
    
    if (!confirmed) {
        return;
    }
    
    try {
        showLoading();
        
        await fetchAPI('/api/history/clear', {
            method: 'DELETE'
        });
        
        showToast('Histórico limpo com sucesso!', 'success');
        
        // Reload dashboard data to reflect changes
        loadDashboardData();
        
    } catch (error) {
        showToast('Erro ao limpar histórico', 'error');
        console.error('Error clearing history:', error);
    } finally {
        hideLoading();
    }
}

function cancelEdit() {
    document.getElementById('question-form').reset();
    document.getElementById('question-id').value = '';
    document.getElementById('question-content').innerHTML = '';
    document.getElementById('question-content-html').value = '';
    document.getElementById('options-list').innerHTML = '';
    document.getElementById('form-title').textContent = 'Adicionar Nova Questão';
    document.getElementById('submit-btn-text').textContent = 'Salvar Questão';
    document.getElementById('cancel-edit').style.display = 'none';
    
    // Remove any dynamically added correct answer field for essay questions
    const existingCorrectAnswerField = document.querySelector('#correct-answer');
    if (existingCorrectAnswerField && existingCorrectAnswerField.tagName === 'TEXTAREA') {
        existingCorrectAnswerField.closest('.form-group').remove();
    }
    
    // Reset to multiple choice
    document.querySelector('input[name="numbering-type"][value="numbers"]').checked = true;
    handleQuestionTypeChange({ target: { value: 'multiple-choice' } });
    updatePreview();
}

// Utility Functions

// Timer Functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startQuizTimer() {
    if (quizTimerInterval) {
        clearInterval(quizTimerInterval);
    }
    
    const startTime = currentQuiz.startTime;
    const timerElement = document.getElementById('quiz-timer');
    
    quizTimerInterval = setInterval(() => {
        const elapsedTime = Math.floor((new Date() - startTime) / 1000);
        timerElement.textContent = formatTime(elapsedTime);
    }, 1000);
    
    // Set initial display
    timerElement.textContent = '00:00';
}

function stopQuizTimer() {
    if (quizTimerInterval) {
        clearInterval(quizTimerInterval);
        quizTimerInterval = null;
    }
}

async function fetchAPI(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro de rede' }));
        throw new Error(error.error || 'Erro de rede');
    }
    
    return response.json();
}

function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

function showElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'block';
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) element.style.display = 'none';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type];
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
}

// Rich Editor Functions
function setupRichEditor() {
    const editor = document.getElementById('question-content');
    const hiddenInput = document.getElementById('question-content-html');
    const toolbar = document.querySelector('.editor-toolbar');
    
    // Editor toolbar events
    toolbar.addEventListener('click', (e) => {
        const btn = e.target.closest('.editor-btn');
        if (!btn) return;
        
        e.preventDefault();
        const command = btn.dataset.command;
        
        switch(command) {
            case 'bold':
            case 'italic':
            case 'underline':
                document.execCommand(command, false, null);
                break;
            case 'insertParagraph':
                document.execCommand('formatBlock', false, 'p');
                break;
            case 'insertLineBreak':
                document.execCommand('insertHTML', false, '<br>');
                break;
        }
        
        editor.focus();
        updateHiddenInput();
        updatePreview();
    });
    
    // Editor content change
    editor.addEventListener('input', () => {
        updateHiddenInput();
        updatePreview();
    });
    
    editor.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, text);
        updateHiddenInput();
        updatePreview();
    });
    
    function updateHiddenInput() {
        hiddenInput.value = editor.innerHTML;
    }
}



function getOptionNumber(index, type) {
    if (type === 'letters') {
        return String.fromCharCode(97 + index); // a, b, c, d...
    } else {
        return (index + 1).toString(); // 1, 2, 3, 4...
    }
}

function updateOptionNumbers() {
    const optionsList = document.getElementById('options-list');
    const numberingType = document.querySelector('input[name="numbering-type"]:checked').value;
    
    Array.from(optionsList.children).forEach((optionDiv, index) => {
        const numberElement = optionDiv.querySelector('.option-number');
        const checkbox = optionDiv.querySelector('input[type="checkbox"]');
        const label = optionDiv.querySelector('label');
        
        const optionNumber = getOptionNumber(index, numberingType);
        numberElement.textContent = optionNumber;
        
        // Update checkbox and label IDs
        checkbox.id = `correct-${index}`;
        checkbox.value = index;
        label.setAttribute('for', `correct-${index}`);
    });
}

function handleCorrectOptionChange(checkbox) {
    // Uncheck other checkboxes (only one correct answer allowed)
    document.querySelectorAll('input[name="correct-option"]').forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
    
    updatePreview();
}

function updatePreview() {
    const questionContent = document.getElementById('question-content').innerHTML;
    const previewQuestion = document.getElementById('preview-question');
    const previewOptions = document.getElementById('preview-options');
    const numberingType = document.querySelector('input[name="numbering-type"]:checked').value;
    
    // Update question preview
    if (questionContent.trim()) {
        previewQuestion.innerHTML = questionContent;
    } else {
        previewQuestion.textContent = 'Digite o enunciado acima para ver a pré-visualização...';
    }
    
    // Update options preview
    previewOptions.innerHTML = '';
    const optionsInputs = document.querySelectorAll('.option-input');
    
    optionsInputs.forEach((optionDiv, index) => {
        const input = optionDiv.querySelector('input[type="text"]');
        const checkbox = optionDiv.querySelector('input[type="checkbox"]');
        const optionText = input.value.trim();
        
        if (optionText) {
            const previewOption = document.createElement('div');
            previewOption.className = `preview-option ${checkbox.checked ? 'correct' : ''}`;
            
            const optionNumber = getOptionNumber(index, numberingType);
            
            previewOption.innerHTML = `
                <div class="preview-option-number">${optionNumber}</div>
                <div class="preview-option-text">${optionText}</div>
            `;
            
            previewOptions.appendChild(previewOption);
        }
    });
}

// Enhanced Question Submission
function getFormQuestionData() {
    const type = document.getElementById('question-type').value;
    const questionContent = document.getElementById('question-content-html').value;
    const explanation = document.getElementById('explanation').value;
    const numberingType = document.querySelector('input[name="numbering-type"]:checked').value;
    
    let options = null;
    let correctAnswer = '';
    
    if (type === 'multiple-choice') {
        const optionsInputs = document.querySelectorAll('.option-input input[type="text"]');
        const correctCheckboxes = document.querySelectorAll('input[name="correct-option"]:checked');
        
        options = Array.from(optionsInputs)
            .map(input => input.value.trim())
            .filter(value => value !== '');
            
        if (correctCheckboxes.length > 0) {
            const correctIndex = parseInt(correctCheckboxes[0].value);
            correctAnswer = options[correctIndex] || '';
        }
    } else {
        const correctAnswerField = document.getElementById('correct-answer');
        if (correctAnswerField) {
            correctAnswer = correctAnswerField.value.trim();
        }
    }
    
    return {
        type,
        question: questionContent,
        options,
        correctAnswer,
        explanation,
        numberingType: type === 'multiple-choice' ? numberingType : null
    };
}

function ensureCorrectAnswerField() {
    const type = document.getElementById('question-type').value;
    let correctAnswerField = document.getElementById('correct-answer');
    
    if (type === 'essay') {
        if (!correctAnswerField || correctAnswerField.tagName !== 'TEXTAREA') {
            // Remove any existing field
            if (correctAnswerField) {
                correctAnswerField.closest('.form-group').remove();
            }
            
            // Create new textarea field
            const correctAnswerFormGroup = document.createElement('div');
            correctAnswerFormGroup.className = 'form-group';
            correctAnswerFormGroup.innerHTML = `
                <label for="correct-answer">Resposta Modelo:</label>
                <textarea id="correct-answer" name="correctAnswer" rows="3" required placeholder="Digite a resposta modelo para a questão discursiva..."></textarea>
            `;
            
            // Insert before explanation field
            const explanationField = document.querySelector('#explanation').closest('.form-group');
            explanationField.parentNode.insertBefore(correctAnswerFormGroup, explanationField);
        }
    } else {
        // Remove essay answer field if exists
        if (correctAnswerField && correctAnswerField.tagName === 'TEXTAREA') {
            correctAnswerField.closest('.form-group').remove();
        }
    }
}

// Make functions available globally for onclick handlers
window.editQuestion = editQuestion;
window.deleteQuestion = deleteQuestion;
window.removeOption = removeOption;
window.handleCorrectOptionChange = handleCorrectOptionChange;
