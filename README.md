# Quiz de Estudos - Plataforma Interativa

Uma aplicação web completa para gerenciar questões de estudo, realizar testes interativos e acompanhar o progresso de aprendizado. Desenvolvida com Node.js, Express e tecnologias web modernas.

## 📸 Interface do Sistema

### Dashboard Geral
![Dashboard Geral](https://github.com/user-attachments/assets/057e37a1-d99e-4b82-b975-cd832d291287)
*Visão geral da plataforma com estatísticas em tempo real e métricas de desempenho*

### Meu Dashboard
![Meu Dashboard](https://github.com/user-attachments/assets/6727e528-3309-4242-8fb3-0fed1c43525c)
*Dashboard pessoal com progresso individual e ações personalizadas*

### Histórico de Testes
![Histórico de Testes](https://github.com/user-attachments/assets/fc244da3-6d90-4127-9839-bcae26eed174)
*Histórico completo com opções de exportação PDF e CSV e análise detalhada*

##  Índice

- [Interface do Sistema](#-interface-do-sistema)
- [Características Principais](#-características-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução](#-instalação-e-execução)
- [Primeiro Acesso e Configurações](#-primeiro-acesso-e-configurações)
- [Cadastrando Questões Manualmente](#cadastrando-questões-manualmente)
- [Como Usar](#-como-usar)
- [Características de UX/UI](#-características-de-uxui)
- [Configuração Avançada](#-configuração-avançada)
- [Solução de Problemas](#-solução-de-problemas)
- [Desenvolvimento Futuro](#-desenvolvimento-futuro)
- [Licença](#-licença)
- [Contribuições](#-contribuições)
- [Suporte](#-suporte)

## ✨ Características Principais

### 📊 Dashboard Inteligente
- Visão geral das estatísticas de estudo
- Contador de questões disponíveis
- Histórico de performance
- Ações rápidas para facilitar a navegação

### 🎯 Sistema de Quiz Avançado
- **Questões de Múltipla Escolha**: Com numeração configurável (letras/números)
- **Questões Discursivas**: Para respostas abertas e desenvolvimento
- **Editor de Texto Rico**: Formatação avançada com HTML e toolbar visual
- **Configuração Flexível**: 
  - Escolha de tipos de questões (múltipla, discursiva ou mista)
  - Quantidade personalizável (de 1 até todas as questões disponíveis)
  - Modos de feedback (imediato ou final)
- **Sistema de Explicações**: Cada questão pode conter explicação detalhada

### 📈 Histórico e Relatórios
- **Histórico Completo**: Todas as sessões são automaticamente salvas
- **Exportação em PDF**: Relatórios detalhados com respostas e estatísticas
- **Exportação em CSV**: Dados estruturados para análise externa
- **Visualização Detalhada**: Análise questão por questão com feedback

### 🔧 Painel Administrativo
- **Login Seguro**: Acesso protegido para gerenciamento
- **CRUD Completo**: Criar, editar, visualizar e excluir questões
- **Interface Intuitiva**: Formulários dinâmicos adaptáveis
- **Validação Robusta**: Verificação de dados em tempo real

### 💾 Persistência Local
- Armazenamento em arquivos JSON
- Sem necessidade de banco de dados externo
- Inicialização automática dos dados
- Backup e restauração simples

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web minimalista
- **CORS**: Habilitação de requisições cross-origin
- **File System**: Gerenciamento de arquivos JSON

### Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Design responsivo com variáveis CSS
- **Vanilla JavaScript**: Funcionalidades interativas
- **Font Awesome**: Ícones vetoriais

### Arquitetura
- **REST API**: Comunicação cliente-servidor
- **SPA (Single Page Application)**: Navegação fluida
- **Responsive Design**: Adaptável a todos os dispositivos
- **Progressive Enhancement**: Funcionalidade incremental

## 📁 Estrutura do Projeto

```
quiz_estudo_project/
├── server.js              # Servidor Express principal
├── dataManager.js         # Gerenciador de dados JSON
├── package.json           # Dependências e scripts
├── README.md             # Documentação
├── data/                 # Arquivos de dados (criado automaticamente)
│   ├── questions.json    # Base de questões
│   ├── history.json      # Histórico de testes
│   └── users.json        # Usuários administrativos
└── public/               # Arquivos estáticos
    ├── index.html        # Interface principal
    ├── styles.css        # Estilos CSS
    └── script.js         # Lógica JavaScript
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes)
- Git (opcional, para clonar o projeto)

### Passo a Passo

1. **Clone o repositório**:
   Abra seu terminal e execute o comando abaixo para clonar o projeto.
   ```bash
   git clone https://github.com/Halbert-Nascimento/QUIZ_ESTUDO_PROJECT.git
   ```

2. **Acesse o diretório do projeto**:
   ```bash
   cd QUIZ_ESTUDO_PROJECT
   ```

3. **Instale as dependências**:
   Este comando irá baixar e instalar todos os pacotes necessários para rodar a aplicação.
   ```bash
   npm install
   ```

4. **Inicie o servidor**:
   ```bash
   npm start
   ```
   O servidor será iniciado e você verá mensagens de log no terminal.

5. **Acesse a aplicação**:
   - Abra seu navegador e acesse: `http://localhost:3000`
   - A aplicação estará pronta para uso!

### Scripts Disponíveis

```bash
npm start        # Inicia o servidor de produção
npm run dev      # Inicia o servidor (mesmo que start)
```

## 👤 Primeiro Acesso e Configurações

### Credenciais dos Diferentes Usuários
O sistema agora suporta diferentes perfis de acesso. As credenciais padrão são:

- **Admin**: `admin` / `admin123`
- **Usuário**: `usuario1` / `user123`
- **Aluno**: `aluno1` / `student123`
- **Professor**: `professor1` / `teacher123`
- **Visitante**: `visitante1` / `visitor123`

### Roles/Perfis Disponíveis
- **admin**: Acesso completo ao painel administrativo
- **usuario**: Usuário padrão do sistema
- **aluno**: Perfil para estudantes
- **professor**: Perfil para educadores
- **visitante**: Perfil para acesso limitado

*Nota: Atualmente, todas as roles permitem login e identificação. Futuramente, serão implementadas permissões específicas para cada perfil.*

### Modificando Credenciais e Adicionando Usuários
Para alterar senhas ou adicionar novos usuários, você pode editar o arquivo `data/users.json` diretamente ou modificar `dataManager.js` antes da primeira execução.

**Exemplo de estrutura em `data/users.json`:**
```json
{
  "admin": {
    "password": "admin123",
    "role": "admin"
  },
  "novo_usuario": {
    "password": "nova-senha",
    "role": "usuario"
  },
  "professor2": {
    "password": "prof456",
    "role": "professor"
  }
}
```

**Exemplo de estrutura em `dataManager.js`:**
```javascript
// ...
const initialUsers = {
    admin: {
        password: 'nova-senha-segura', // Altere aqui
        role: 'admin'
    },
    // Adicione novos usuários
    outro_usuario: {
        password: 'outra-senha',
        role: 'usuario' // Roles disponíveis: admin, usuario, aluno, professor, visitante
    }
};
// ...
```

### Cadastrando Questões Manualmente
Você pode adicionar questões diretamente no arquivo `data/questions.json`. Esta é uma forma rápida de popular o banco de dados sem usar a interface de administração.

**Estrutura Geral do Arquivo `questions.json`:**
```json
{
  "questions": [
    // Array de objetos de questão (múltipla escolha e discursivas)
  ],
  "nextId": 3 // ID a ser usado para a próxima questão cadastrada
}
```

**Estrutura para questão de Múltipla Escolha:**
```json
{
  "id": 1,
  "type": "multiple-choice",
  "question": "Qual é a capital do Brasil?",
  "options": [
    "Rio de Janeiro",
    "São Paulo",
    "Brasília",
    "Salvador"
  ],
  "correctAnswer": "Brasília",
  "explanation": "Brasília foi inaugurada como capital do Brasil em 1960.",
  "numberingType": "letters",
  "createdAt": "2025-09-23T20:44:20.264Z"
}
```

**Estrutura para questão Discursiva:**
```json
{
  "id": 2,
  "type": "essay",
  "question": "Discorra sobre a importância da Revolução Francesa.",
  "correctAnswer": "A resposta deve abordar os ideais de Liberdade, Igualdade e Fraternidade, a queda do absolutismo e o impacto na política moderna.",
  "explanation": "A Revolução Francesa foi um marco para o fim do Antigo Regime e a ascensão da burguesia.",
  "createdAt": "2025-09-23T20:44:20.264Z"
}
```

**Exemplo de arquivo `questions.json` completo:**
```json
{
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "Qual é a capital do Brasil?",
      "options": [
        "Rio de Janeiro",
        "São Paulo",
        "Brasília",
        "Salvador"
      ],
      "correctAnswer": "Brasília",
      "explanation": "Brasília foi inaugurada como capital do Brasil em 1960.",
      "numberingType": "letters",
      "createdAt": "2025-09-23T20:44:20.264Z"
    },
    {
      "id": 2,
      "type": "essay",
      "question": "Discorra sobre a importância da Revolução Francesa.",
      "correctAnswer": "A resposta deve abordar os ideais de Liberdade, Igualdade e Fraternidade, a queda do absolutismo e o impacto na política moderna.",
      "explanation": "A Revolução Francesa foi um marco para o fim do Antigo Regime e a ascensão da burguesia.",
      "createdAt": "2025-09-23T20:44:20.264Z"
    }
  ],
  "nextId": 3
}
```

**Importante**:
- O campo `id` deve ser único para cada questão.
- O `type` pode ser `"multiple-choice"` ou `"essay"`.
- `numberingType` é opcional e define o tipo de numeração das opções (ex: "letters" para a, b, c...).
- O campo `createdAt` deve estar no formato ISO (você pode usar `new Date().toISOString()`).
- Mantenha o campo `nextId` correto (deve ser maior que o maior ID existente).

## 📝 Como Usar

### Cadastrando Questões

1. **Acesse Admin > Adicionar Questão**
2. **Escolha o Tipo**:
   - **Múltipla Escolha**: Para questões com opções fixas
   - **Discursiva**: Para respostas abertas
3. **Preencha os Campos**:
   - Enunciado da questão (com suporte ao editor rico)
   - Opções (se múltipla escolha)
   - Resposta correta
   - Explicação (opcional)
4. **Use o Editor de Texto Rico**:
   - **Negrito**, *Itálico* e ~~Tachado~~
   - Listas numeradas e com marcadores
   - Títulos e subtítulos
   - Inserção de links e imagens
5. **Salve a Questão**

### Realizando Testes

1. **Dashboard > Começar Novo Teste**
2. **Configure o Teste**:
   - Número de questões (até o máximo disponível)
   - Modo de feedback (imediato ou no final)
   - Utilize filtros para personalizar seu teste (opcional)
3. **Responda as Questões**:
   - Uma questão por vez
   - Interface adaptável ao tipo
4. **Visualize os Resultados**:
   - Pontuação final
   - Detalhamento das respostas
   - Salvamento automático no histórico

### Utilizando Filtros de Questões

1. **Na tela de Dashboard ou Admin**:
   - Utilize a barra de pesquisa para encontrar questões específicas
   - Filtre por palavras-chave no enunciado ou explicação
   - Filtre por tipo de questão (múltipla escolha/discursiva)
2. **Ao configurar um teste**:
   - Selecione apenas questões de determinado tema
   - Combine múltiplos critérios para uma seleção refinada
3. **No painel administrativo**:
   - Organize questões por data de criação
   - Encontre rapidamente questões para edição ou revisão

### Acompanhando Progresso

1. **Acesse o Histórico**: Visualize todas as sessões
2. **Explore os Detalhes**: Clique em qualquer sessão
3. **Analise Performance**: Compare resultados ao longo do tempo

## 🎨 Características de UX/UI

### Design Moderno
- **Paleta de Cores Harmoniosa**: Azul primário com tons neutros
- **Tipografia Legível**: Segoe UI para máxima legibilidade
- **Espaçamento Consistente**: Sistema de espaçamento baseado em módulos
- **Sombreamento Sutil**: Elevação visual dos componentes

### Responsividade
- **Mobile First**: Otimizado para dispositivos móveis
- **Breakpoints Inteligentes**: Adaptação fluida em todas as telas
- **Touch Friendly**: Botões e áreas de toque adequadas
- **Navegação Simplificada**: Interface condensada em telas pequenas

### Interatividade
- **Feedback Visual**: Hover states e transições suaves
- **Loading States**: Indicadores de carregamento
- **Toast Notifications**: Feedback imediato de ações
- **Validação em Tempo Real**: Prevenção de erros

### Acessibilidade
- **Contraste Adequado**: Seguindo diretrizes WCAG
- **Navegação por Teclado**: Suporte completo
- **Ícones Semânticos**: Font Awesome para melhor compreensão
- **Estrutura Semântica**: HTML5 bem estruturado

## 🔧 Configuração Avançada

### Modificando Credenciais de Admin
Edite o arquivo `dataManager.js` na seção de inicialização de usuários:

```javascript
const initialUsers = {
    admin: {
        password: 'sua-nova-senha',
        role: 'admin'
    }
};
```

### Personalizando Porta do Servidor
Por padrão, o servidor está configurado para usar a porta 3000. Se desejar alterá-la, modifique o arquivo `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

### Acessando o Projeto em Rede Local
O servidor está configurado para ser acessível por outras máquinas na mesma rede local, permitindo que outros dispositivos (como smartphones, tablets ou outros computadores) acessem o sistema de quiz:

1. **Inicie o servidor normalmente**:
   ```bash
   npm start
   ```

2. **Encontre seu IP na rede local**:
   ```bash
   # No Windows
   ipconfig
   # Procure pelo IPv4 Address na sua conexão ativa (geralmente WiFi ou Ethernet)

   # No Linux/Mac
   ifconfig
   # ou
   ip addr
   # Procure pelo inet na interface de rede ativa
   ```

3. **Acesse pelo navegador em outros dispositivos**:
   ```
   http://SEU_IP_LOCAL:3000
   ```
   Por exemplo: `http://192.168.1.5:3000`

4. **Importante**: Todos os dispositivos devem estar conectados à mesma rede local (WiFi ou LAN).

5. **Resolvendo problemas de acesso**:
   - Verifique se não há firewall bloqueando a porta 3000
   - Certifique-se de que o computador servidor permite conexões na porta 3000
   - Verifique se o servidor está rodando corretamente

### Backup dos Dados
Os dados ficam no diretório `data/`. Para backup:

```bash
# Copie a pasta data
cp -r data/ backup-data-$(date +%Y%m%d)/
```

## 🐛 Solução de Problemas

### Servidor não inicia
- Verifique se o Node.js está instalado: `node --version`
- Verifique se as dependências foram instaladas: `npm install`
- Verifique se a porta 3000 está livre (você pode alterar a porta em `server.js`)

### Questões não aparecem
- Verifique se há questões cadastradas no Admin
- Verifique permissões de escrita na pasta `data/`
- Verifique o console do navegador para erros

### Login não funciona
- Use as credenciais padrão: `admin` / `admin123`
- Verifique se o arquivo `users.json` existe na pasta `data/`

## 🚀 Desenvolvimento Futuro

### Funcionalidades Planejadas
- [ ] **Sistema de autenticação avançado** - Login/registro de usuários com diferentes perfis
- [ ] **Compartilhamento de estudos** - Geração de código para que colegas respondam ao mesmo teste e comparem resultados
- [ ] **Categorização por matéria/tema** - Organização de questões por disciplinas e assuntos
- [ ] **Desafios em grupo e competições** - Modo multiplayer com rankings e torneios
- [ ] **Sistema de feedback detalhado** - Comentários e explicações personalizadas por questão
- [ ] **Gerenciamento de permissões** - Controle de acesso granular por usuário e grupo
- [ ] **Temporizador por questão** - Controle de tempo individual e configurável
- [ ] **Sistema de badges e conquistas** - Gamificação com recompensas por progresso
- [ ] **Relatórios avançados de performance** - Analytics detalhados de desempenho
- [ ] **Integração com bancos de dados** - Suporte a PostgreSQL, MySQL, MongoDB
- [ ] **API para integração externa** - RESTful API para conectar com outros sistemas
- [ ] **Modo offline (PWA)** - Funcionamento sem conexão com sincronização posterior

### Funcionalidades Implementadas
- [x] **Exportação de relatórios em PDF** - Sistema completo de geração de relatórios em PDF
- [x] **Exportação de dados em CSV** - Opção para exportar resultados em formato CSV
- [x] **Sistema de questões múltipla escolha e discursivas**
- [x] **Interface administrativa completa**
- [x] **Dashboard com estatísticas**
- [x] **Sistema de feedback configurável**
- [x] **Histórico de testes realizados**

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] Docker containerização
- [ ] CI/CD pipeline
- [ ] Monitoramento e logs
- [ ] Caching de questões
- [ ] Compressão de dados

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Reportar bugs
2. Sugerir novas funcionalidades
3. Enviar pull requests
4. Melhorar a documentação

## 📞 Suporte

Para suporte, dúvidas ou sugestões:
- Abra uma issue no repositório
- Consulte a documentação
- Verifique os logs do servidor console

---

**Desenvolvido com ❤️ para facilitar seus estudos!**
