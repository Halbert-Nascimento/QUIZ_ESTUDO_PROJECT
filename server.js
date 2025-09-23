const express = require('express');
const cors = require('cors');
const path = require('path');
const DataManager = require('./dataManager');

const app = express();
const PORT = process.env.PORT || 3000;
const dataManager = new DataManager();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// APIs para Questões
app.get('/api/questions', (req, res) => {
    try {
        const questions = dataManager.getAllQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar questões' });
    }
});

app.get('/api/questions/:id', (req, res) => {
    try {
        const question = dataManager.getQuestionById(req.params.id);
        if (!question) {
            return res.status(404).json({ error: 'Questão não encontrada' });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar questão' });
    }
});

app.post('/api/questions', (req, res) => {
    try {
        const { type, question, options, correctAnswer, explanation, numberingType } = req.body;
        
        // Validação básica
        if (!type || !question || !correctAnswer) {
            return res.status(400).json({ error: 'Campos obrigatórios: type, question, correctAnswer' });
        }

        if (type === 'multiple-choice' && (!options || options.length < 2)) {
            return res.status(400).json({ error: 'Questões de múltipla escolha precisam ter pelo menos 2 opções' });
        }

        const questionData = {
            type,
            question,
            options: type === 'multiple-choice' ? options : null,
            correctAnswer,
            explanation: explanation || '',
            numberingType: type === 'multiple-choice' ? (numberingType || 'numbers') : null
        };

        const newQuestion = dataManager.addQuestion(questionData);
        if (!newQuestion) {
            return res.status(500).json({ error: 'Erro ao salvar questão' });
        }

        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/questions/:id', (req, res) => {
    try {
        const { type, question, options, correctAnswer, explanation, numberingType } = req.body;
        
        const questionData = {
            type,
            question,
            options: type === 'multiple-choice' ? options : null,
            correctAnswer,
            explanation: explanation || '',
            numberingType: type === 'multiple-choice' ? (numberingType || 'numbers') : null
        };

        const success = dataManager.updateQuestion(req.params.id, questionData);
        if (!success) {
            return res.status(404).json({ error: 'Questão não encontrada' });
        }

        res.json({ message: 'Questão atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar questão' });
    }
});

app.delete('/api/questions/:id', (req, res) => {
    try {
        const success = dataManager.deleteQuestion(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Questão não encontrada' });
        }

        res.json({ message: 'Questão deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar questão' });
    }
});

// API para obter questões aleatórias para teste
app.get('/api/quiz/:count', (req, res) => {
    try {
        const count = parseInt(req.params.count);
        const typeFilter = req.query.type || 'mixed'; // 'multiple-choice', 'essay', or 'mixed'
        
        if (isNaN(count) || count <= 0) {
            return res.status(400).json({ error: 'Número de questões inválido' });
        }

        const questions = dataManager.getRandomQuestionsByType(count, typeFilter);
        
        // Remove a resposta correta das questões para não vazar no frontend
        const questionsForQuiz = questions.map(q => ({
            id: q.id,
            type: q.type,
            question: q.question,
            options: q.options,
            numberingType: q.numberingType
        }));

        res.json(questionsForQuiz);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar quiz' });
    }
});

// API para verificar respostas
app.post('/api/quiz/check', (req, res) => {
    try {
        const { questionId, userAnswer } = req.body;
        
        const question = dataManager.getQuestionById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Questão não encontrada' });
        }

        const isCorrect = question.correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
        
        res.json({
            correct: isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao verificar resposta' });
    }
});

// APIs para Histórico
app.get('/api/history', (req, res) => {
    try {
        const history = dataManager.getAllHistory();
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
});

app.get('/api/history/:id', (req, res) => {
    try {
        const session = dataManager.getSessionById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Sessão não encontrada' });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar sessão' });
    }
});

app.post('/api/history', (req, res) => {
    try {
        const { totalQuestions, correctAnswers, wrongAnswers, questions, feedbackMode } = req.body;
        
        const sessionData = {
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            questions,
            feedbackMode,
            score: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
        };

        const newSession = dataManager.addTestSession(sessionData);
        if (!newSession) {
            return res.status(500).json({ error: 'Erro ao salvar sessão' });
        }

        res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// API para Login
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username e password são obrigatórios' });
        }

        const isValid = dataManager.validateLogin(username, password);
        if (!isValid) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        res.json({ 
            message: 'Login realizado com sucesso',
            role: 'admin'
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// API para Estatísticas
app.get('/api/stats', (req, res) => {
    try {
        const stats = dataManager.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware para tratar erros
app.use((error, req, res, next) => {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Acesse a aplicação em: http://localhost:${PORT}`);
    console.log(`👤 Login admin: username=admin, password=admin123`);
});

module.exports = app;
