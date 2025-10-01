const fs = require('fs');
const path = require('path');

class DataManager {
    constructor() {
        this.dataDir = path.join(__dirname, 'data');
        this.questionsFile = path.join(this.dataDir, 'questions.json');
        this.historyFile = path.join(this.dataDir, 'history.json');
        this.usersFile = path.join(this.dataDir, 'users.json');
        
        this.initializeData();
    }

    // Inicializa os arquivos de dados se não existirem
    initializeData() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }

        // Inicializar arquivo de questões
        if (!fs.existsSync(this.questionsFile)) {
            const initialQuestions = {
                questions: [],
                nextId: 1
            };
            this.writeFile(this.questionsFile, initialQuestions);
        }

        // Inicializar arquivo de histórico
        if (!fs.existsSync(this.historyFile)) {
            const initialHistory = {
                sessions: [],
                nextId: 1
            };
            this.writeFile(this.historyFile, initialHistory);
        }

        // Inicializar arquivo de usuários (para login admin)
        if (!fs.existsSync(this.usersFile)) {
            const initialUsers = {
                admin: {
                    password: 'admin123', // Em produção, isso deveria ser hasheado
                    role: 'admin'
                }
            };
            this.writeFile(this.usersFile, initialUsers);
        }
    }

    // Métodos auxiliares para leitura e escrita
    readFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Erro ao ler arquivo ${filePath}:`, error);
            return null;
        }
    }

    writeFile(filePath, data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error(`Erro ao escrever arquivo ${filePath}:`, error);
            return false;
        }
    }

    // CRUD para Questões
    getAllQuestions() {
        const data = this.readFile(this.questionsFile);
        return data ? data.questions : [];
    }

    getQuestionById(id) {
        const questions = this.getAllQuestions();
        return questions.find(q => q.id === parseInt(id));
    }

    addQuestion(questionData) {
        const data = this.readFile(this.questionsFile);
        if (!data) return null;

        const newQuestion = {
            id: data.nextId,
            ...questionData,
            createdAt: new Date().toISOString()
        };

        data.questions.push(newQuestion);
        data.nextId++;

        if (this.writeFile(this.questionsFile, data)) {
            return newQuestion;
        }
        return null;
    }

    updateQuestion(id, questionData) {
        const data = this.readFile(this.questionsFile);
        if (!data) return false;

        const index = data.questions.findIndex(q => q.id === parseInt(id));
        if (index === -1) return false;

        data.questions[index] = {
            ...data.questions[index],
            ...questionData,
            updatedAt: new Date().toISOString()
        };

        return this.writeFile(this.questionsFile, data);
    }

    deleteQuestion(id) {
        const data = this.readFile(this.questionsFile);
        if (!data) return false;

        const index = data.questions.findIndex(q => q.id === parseInt(id));
        if (index === -1) return false;

        data.questions.splice(index, 1);
        return this.writeFile(this.questionsFile, data);
    }

    // Métodos para Histórico de Testes
    getAllHistory(browserSessionId = null) {
        const data = this.readFile(this.historyFile);
        let sessions = data ? data.sessions : [];
        
        // If browserSessionId is provided, filter by it
        if (browserSessionId) {
            sessions = sessions.filter(session => session.browserSessionId === browserSessionId);
        }
        
        return sessions;
    }

    addTestSession(sessionData) {
        const data = this.readFile(this.historyFile);
        if (!data) return null;

        const newSession = {
            id: data.nextId,
            ...sessionData,
            date: new Date().toISOString()
        };

        data.sessions.push(newSession);
        data.nextId++;

        if (this.writeFile(this.historyFile, data)) {
            return newSession;
        }
        return null;
    }

    getSessionById(id) {
        const sessions = this.getAllHistory();
        return sessions.find(s => s.id === parseInt(id));
    }

    // Método para obter questões aleatórias
    getRandomQuestions(count) {
        const allQuestions = this.getAllQuestions();
        
        if (allQuestions.length === 0) {
            return [];
        }

        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, allQuestions.length));
    }

    // Método para obter questões aleatórias por tipo e matéria
    getRandomQuestionsByType(count, typeFilter = 'mixed', subjectFilter = null) {
        const allQuestions = this.getAllQuestions();
        
        if (allQuestions.length === 0) {
            return [];
        }

        let filteredQuestions = [];
        
        // Filter by type first
        switch (typeFilter) {
            case 'multiple-choice':
                filteredQuestions = allQuestions.filter(q => q.type === 'multiple-choice');
                break;
            case 'essay':
                filteredQuestions = allQuestions.filter(q => q.type === 'essay');
                break;
            case 'mixed':
            default:
                filteredQuestions = allQuestions;
                break;
        }

        // Filter by subject if specified
        if (subjectFilter && subjectFilter !== 'all') {
            if (subjectFilter === 'no-subject') {
                // Questions without subject
                filteredQuestions = filteredQuestions.filter(q => !q.subject || q.subject === '');
            } else {
                // Questions with specific subject
                filteredQuestions = filteredQuestions.filter(q => q.subject === subjectFilter);
            }
        }

        if (filteredQuestions.length === 0) {
            return [];
        }

        const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, filteredQuestions.length));
    }

    // Método para obter lista de matérias disponíveis
    getAvailableSubjects() {
        const allQuestions = this.getAllQuestions();
        const subjects = new Set();
        
        allQuestions.forEach(q => {
            if (q.subject && q.subject.trim() !== '') {
                subjects.add(q.subject.trim());
            }
        });
        
        return Array.from(subjects).sort();
    }

    // Método para obter contagem de questões por matéria
    getQuestionCountBySubject() {
        const allQuestions = this.getAllQuestions();
        const counts = {};
        
        allQuestions.forEach(q => {
            const subject = q.subject && q.subject.trim() !== '' ? q.subject.trim() : 'no-subject';
            counts[subject] = (counts[subject] || 0) + 1;
        });
        
        return counts;
    }

    // Método para validar login
    validateLogin(username, password) {
        const users = this.readFile(this.usersFile);
        if (!users || !users[username]) {
            return false;
        }

        return users[username].password === password;
    }

    // Método para obter estatísticas
    getStats() {
        const questions = this.getAllQuestions();
        const sessions = this.getAllHistory();
        
        const totalSessions = sessions.length;
        const totalQuestions = questions.length;
        const multipleChoiceQuestions = questions.filter(q => q.type === 'multiple-choice').length;
        const essayQuestions = questions.filter(q => q.type === 'essay').length;
        
        let totalAnswered = 0;
        let totalCorrect = 0;
        
        sessions.forEach(session => {
            totalAnswered += session.totalQuestions;
            totalCorrect += session.correctAnswers;
        });

        const averageScore = totalAnswered > 0 ? (totalCorrect / totalAnswered * 100).toFixed(1) : 0;

        return {
            totalQuestions,
            multipleChoiceQuestions,
            essayQuestions,
            totalSessions,
            totalAnswered,
            totalCorrect,
            averageScore
        };
    }

    clearHistory(browserSessionId = null) {
        try {
            const data = this.readFile(this.historyFile);
            if (!data) return false;
            
            if (browserSessionId) {
                // Clear only sessions for specific browser session
                data.sessions = data.sessions.filter(session => session.browserSessionId !== browserSessionId);
            } else {
                // Clear all sessions (admin functionality)
                data.sessions = [];
                data.nextId = 1;
            }
            
            return this.writeFile(this.historyFile, data);
        } catch (error) {
            console.error('Erro ao limpar histórico:', error);
            return false;
        }
    }
}

module.exports = DataManager;
