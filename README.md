# Quiz de Estudos - Plataforma Interativa

Uma aplicação web completa para gerenciar questões de estudo, realizar testes interativos e acompanhar o progresso de aprendizado. Desenvolvida com Node.js, Express e tecnologias web modernas.

##  Índice

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

## Características Principais

### 📊 Dashboard Inteligente
- Visão geral das estatísticas de estudo
- Contador de questões disponíveis
- Histórico de performance
- Ações rápidas para facilitar a navegação

### 🎯 Sistema de Quiz Avançado
- **Questões de Múltipla Escolha**: Com suporte a número variável de opções
- **Questões Discursivas**: Para respostas abertas e desenvolvimento
- **Editor de Texto Rico**: Formatação avançada para questões e explicações
- **Feedback Configurável**: 
  - Imediato (após cada questão)
  - No final (relatório completo)
- **Seleção Aleatória**: Questões escolhidas randomicamente
- **Progresso Visual**: Barra de progresso e contador de questões

### 📈 Histórico Detalhado
- Salvamento automático de todas as sessões
- Estatísticas por teste (acertos, erros, pontuação)
- Visualização detalhada das respostas
- Ordenação cronológica das sessões

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
npm run network  # Inicia o servidor para acesso em rede local
```

## 👤 Primeiro Acesso e Configurações

### Credenciais Padrão
- **Usuário**: `admin`
- **Senha**: `admin123`

### Modificando Credenciais de Admin
Para alterar a senha do usuário `admin` ou adicionar novos usuários, você pode editar o arquivo `dataManager.js` antes da primeira inicialização. Se o arquivo `data/users.json` já foi criado, você pode editá-lo diretamente.

**Exemplo de estrutura em `dataManager.js`:**
```javascript
// ...
if (!fs.existsSync(usersFilePath)) {
    const initialUsers = {
        admin: {
            password: 'nova-senha-segura', // Altere aqui
            role: 'admin'
        },
        // Você pode adicionar outros usuários
        outro_usuario: {
            password: 'outra-senha',
            role: 'user' // Role 'user' ainda não tem permissões especiais
        }
    };
    fs.writeFileSync(usersFilePath, JSON.stringify(initialUsers, null, 2));
}
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

1. **Inicie o servidor com o comando específico para rede**:
   ```bash
   npm run network
   ```
   Este comando inicia o servidor vinculado ao endereço `0.0.0.0`, tornando-o acessível por todas as interfaces de rede.

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
   - Verifique se não há firewall bloqueando a porta 4444
   - Certifique-se de que o computador servidor permite conexões na porta 3000
   - Verifique se o servidor está rodando corretamente com o comando `npm run network`

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
- Verifique se a porta 4444 está livre (você pode alterar a porta em `server.js`)

### Questões não aparecem
- Verifique se há questões cadastradas no Admin
- Verifique permissões de escrita na pasta `data/`
- Verifique o console do navegador para erros

### Login não funciona
- Use as credenciais padrão: `admin` / `admin123`
- Verifique se o arquivo `users.json` existe na pasta `data/`

## 🚀 Desenvolvimento Futuro

### Funcionalidades Planejadas
- [ ] Sistema de categorias/tags para questões
- [ ] Temporizador por questão
- [ ] Exportação de relatórios em PDF
- [ ] Sistema de múltiplos usuários
- [ ] Integração com bancos de dados
- [ ] API para integração externa
- [ ] Modo offline (PWA)

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
