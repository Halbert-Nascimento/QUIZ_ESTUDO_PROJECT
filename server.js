const express = require('express');
const cors = require('cors');
const path = require('path');
const DataManager = require('./dataManager');
const { jsPDF } = require('jspdf');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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

// API para limpar histórico
app.delete('/api/history/clear', (req, res) => {
    try {
        const success = dataManager.clearHistory();
        if (!success) {
            return res.status(500).json({ error: 'Erro ao limpar histórico' });
        }
        res.json({ message: 'Histórico limpo com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao limpar histórico' });
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

// API para exportar sessão em PDF
app.get('/api/export/session/:id/pdf', (req, res) => {
    try {
        const session = dataManager.getSessionById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Sessão não encontrada' });
        }

        // Criar PDF
        const doc = new jsPDF();
        let currentY = 20;
        
        // Configurar título
        doc.setFontSize(20);
        doc.text('Relatório do Teste - Quiz de Estudos', 20, currentY);
        currentY += 20;
        
        // Informações gerais
        doc.setFontSize(12);
        const date = new Date(session.date).toLocaleString('pt-BR');
        const score = Math.round((session.correctAnswers / session.totalQuestions) * 100);
        const duration = session.duration ? formatDuration(session.duration) : 'N/A';
        
        doc.text(`Data: ${date}`, 20, currentY);
        currentY += 10;
        doc.text(`Questões Totais: ${session.totalQuestions}`, 20, currentY);
        currentY += 10;
        doc.text(`Respostas Corretas: ${session.correctAnswers}`, 20, currentY);
        currentY += 10;
        doc.text(`Respostas Erradas: ${session.wrongAnswers}`, 20, currentY);
        currentY += 10;
        doc.text(`Pontuação Final: ${score}%`, 20, currentY);
        currentY += 10;
        doc.text(`Tempo Gasto: ${duration}`, 20, currentY);
        currentY += 20;
        
        // Verificar se há questões
        if (!session.questions || session.questions.length === 0) {
            doc.text('Nenhum detalhe de questão disponível', 20, currentY);
        } else {
            // Título das questões
            doc.setFontSize(14);
            doc.text('Detalhes das Questões:', 20, currentY);
            currentY += 15;
            
            doc.setFontSize(10);
            
            // Detalhes de cada questão
            session.questions.forEach((q, index) => {
                // Verificar se precisa de nova página
                if (currentY > 250) {
                    doc.addPage();
                    currentY = 20;
                }
                
                // Número e status da questão
                const status = q.isCorrect ? 'CORRETO' : 'INCORRETO';
                doc.setFont(undefined, 'bold');
                doc.text(`Questão ${index + 1} - ${status}`, 20, currentY);
                currentY += 8;
                
                doc.setFont(undefined, 'normal');
                
                // Pergunta (limitada para caber na página)
                const cleanQuestion = (q.question || '').replace(/<[^>]*>/g, '');
                const questionLines = doc.splitTextToSize(cleanQuestion, 170);
                doc.text('Pergunta:', 20, currentY);
                currentY += 6;
                doc.text(questionLines.slice(0, 3), 25, currentY); // Máximo 3 linhas
                currentY += (Math.min(questionLines.length, 3) * 5) + 5;
                
                // Resposta do usuário
                doc.text('Sua Resposta:', 20, currentY);
                currentY += 6;
                const userAnswerLines = doc.splitTextToSize(q.userAnswer || 'N/A', 170);
                doc.text(userAnswerLines.slice(0, 2), 25, currentY); // Máximo 2 linhas
                currentY += (Math.min(userAnswerLines.length, 2) * 5) + 5;
                
                // Resposta correta
                doc.text('Resposta Correta:', 20, currentY);
                currentY += 6;
                const correctAnswerLines = doc.splitTextToSize(q.correctAnswer || 'N/A', 170);
                doc.text(correctAnswerLines.slice(0, 2), 25, currentY); // Máximo 2 linhas
                currentY += (Math.min(correctAnswerLines.length, 2) * 5) + 5;
                
                // Explicação (se houver)
                if (q.explanation) {
                    doc.text('Explicação:', 20, currentY);
                    currentY += 6;
                    const explanationLines = doc.splitTextToSize(q.explanation, 170);
                    doc.text(explanationLines.slice(0, 2), 25, currentY); // Máximo 2 linhas
                    currentY += (Math.min(explanationLines.length, 2) * 5) + 5;
                }
                
                currentY += 10; // Espaço entre questões
            });
        }
        
        // Configurar resposta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="resultado_teste_${session.id}.pdf"`);
        
        // Enviar PDF como string Base64 para evitar problemas com buffer
        const pdfOutput = doc.output('datauristring');
        const pdfBase64 = pdfOutput.split(',')[1];
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).json({ error: 'Erro ao gerar relatório PDF' });
    }
});

// API para exportar sessão em CSV
app.get('/api/export/session/:id/csv', (req, res) => {
    try {
        const session = dataManager.getSessionById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Sessão não encontrada' });
        }

        // Preparar dados para CSV
        const date = new Date(session.date).toLocaleString('pt-BR');
        const score = Math.round((session.correctAnswers / session.totalQuestions) * 100);
        const duration = session.duration ? formatDuration(session.duration) : 'N/A';
        
        // Preparar dados para CSV
        const csvData = [];
        
        // Adicionar linha de cabeçalho geral
        csvData.push({
            questao: 'INFORMAÇÕES GERAIS',
            sua_resposta: '',
            resposta_correta: '',
            status: '',
            explicacao: ''
        });
        
        csvData.push({
            questao: `Data: ${date}`,
            sua_resposta: `Total de Questões: ${session.totalQuestions}`,
            resposta_correta: `Corretas: ${session.correctAnswers}`,
            status: `Erradas: ${session.wrongAnswers}`,
            explicacao: `Pontuação: ${score}% | Tempo: ${duration}`
        });
        
        // Linha em branco
        csvData.push({
            questao: '',
            sua_resposta: '',
            resposta_correta: '',
            status: '',
            explicacao: ''
        });
        
        // Cabeçalho das questões
        csvData.push({
            questao: 'QUESTÃO',
            sua_resposta: 'SUA RESPOSTA',
            resposta_correta: 'RESPOSTA CORRETA',
            status: 'STATUS',
            explicacao: 'EXPLICAÇÃO'
        });
        
        // Verificar se há questões
        if (!session.questions || session.questions.length === 0) {
            csvData.push({
                questao: 'Nenhum detalhe de questão disponível',
                sua_resposta: '',
                resposta_correta: '',
                status: '',
                explicacao: ''
            });
        } else {
            // Dados das questões
            session.questions.forEach((q, index) => {
                csvData.push({
                    questao: `${index + 1}. ${(q.question || '').replace(/<[^>]*>/g, '')}`,
                    sua_resposta: q.userAnswer || 'N/A',
                    resposta_correta: q.correctAnswer || 'N/A',
                    status: q.isCorrect ? 'CORRETO' : 'INCORRETO',
                    explicacao: q.explanation || 'N/A'
                });
            });
        }
        
        // Gerar CSV
        let csvContent = 'Questão,Sua Resposta,Resposta Correta,Status,Explicação\n';
        csvData.forEach(row => {
            // Escapar aspas duplas no CSV
            const escapeField = (field) => `"${(field || '').toString().replace(/"/g, '""')}"`;
            csvContent += `${escapeField(row.questao)},${escapeField(row.sua_resposta)},${escapeField(row.resposta_correta)},${escapeField(row.status)},${escapeField(row.explicacao)}\n`;
        });
        
        // Configurar resposta
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="resultado_teste_${session.id}.csv"`);
        
        // Adicionar BOM para UTF-8
        res.write('\ufeff');
        res.end(csvContent);
        
    } catch (error) {
        console.error('Erro ao gerar CSV:', error);
        res.status(500).json({ error: 'Erro ao gerar relatório CSV' });
    }
});

// Função auxiliar para formatar duração
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
}

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
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Acesso local: http://localhost:${PORT}`);
    console.log(`🌐 Acesso externo: http://[SEU_IP]:${PORT}`);
    console.log(`👤 Login admin: username=admin, password=admin123`);
    console.log(`\n📋 Para descobrir seu IP:`);
    console.log(`   Windows: ipconfig`);
    console.log(`   Linux/Mac: ifconfig ou ip addr`);
});

module.exports = app;
