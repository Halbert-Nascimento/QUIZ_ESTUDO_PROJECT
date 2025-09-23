# Quiz de Estudos - Plataforma Interativa

Uma aplicação web completa para gerenciar questões de estudo, realizar testes interativos e acompanhar o progresso de aprendizado. Desenvolvida com Node.js, Express e tecnologias web modernas.

## 🚀 Características Principais

### 📊 Dashboard Inteligente
- Visão geral das estatísticas de estudo
- Contador de questões disponíveis
- Histórico de performance
- Ações rápidas para facilitar a navegação

### 🎯 Sistema de Quiz Avançado
- **Questões de Múltipla Escolha**: Com suporte a número variável de opções
- **Questões Discursivas**: Para respostas abertas e desenvolvimento
- **Feedback Configurable**: 
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

### Passo a Passo

1. **Clone ou baixe o projeto**:
   ```bash
   # Se usando Git
   git clone [repository-url]
   cd quiz_estudo_project
   
   # Ou extraia os arquivos no diretório
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor**:
   ```bash
   npm start
   # ou
   node server.js
   ```

4. **Acesse a aplicação**:
   - Abra o navegador em: `http://localhost:3000`
   - A aplicação estará pronta para uso!

### Scripts Disponíveis

```bash
npm start     # Inicia o servidor de produção
npm run dev   # Inicia o servidor (mesmo que start)
```

## 👤 Primeiro Acesso

### Credenciais Padrão
- **Usuário**: `admin`
- **Senha**: `admin123`

### Primeiros Passos
1. **Acesse o Dashboard**: Visualize as estatísticas iniciais (zeradas)
2. **Entre no Painel Admin**: Use as credenciais padrão
3. **Cadastre Questões**: Adicione suas primeiras questões
4. **Faça um Teste**: Configure e realize seu primeiro quiz
5. **Visualize o Histórico**: Acompanhe seus resultados

## 📝 Como Usar

### Cadastrando Questões

1. **Acesse Admin > Adicionar Questão**
2. **Escolha o Tipo**:
   - **Múltipla Escolha**: Para questões com opções fixas
   - **Discursiva**: Para respostas abertas
3. **Preencha os Campos**:
   - Enunciado da questão
   - Opções (se múltipla escolha)
   - Resposta correta
   - Explicação (opcional)
4. **Salve a Questão**

### Realizando Testes

1. **Dashboard > Começar Novo Teste**
2. **Configure o Teste**:
   - Número de questões (até o máximo disponível)
   - Modo de feedback (imediato ou no final)
3. **Responda as Questões**:
   - Uma questão por vez
   - Interface adaptável ao tipo
4. **Visualize os Resultados**:
   - Pontuação final
   - Detalhamento das respostas
   - Salvamento automático no histórico

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
Defina a variável de ambiente `PORT` ou modifique `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

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
- Verifique se a porta 3000 está livre

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
