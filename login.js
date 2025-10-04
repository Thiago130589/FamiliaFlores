// Verifica se as variáveis globais foram inicializadas pelo firebase-init.js
const firestore = typeof db !== 'undefined' ? db : null;
const firebaseAuth = typeof auth !== 'undefined' ? auth : null;

// Elementos do DOM
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('login-username');
const passwordInput = document.getElementById('login-password');
const loginMessage = document.getElementById('login-message');

/**
 * Exibe uma mensagem de feedback na tela.
 * @param {string} message A mensagem a ser exibida.
 * @param {string} type O tipo de mensagem ('success' ou 'error').
 */
function showMessage(message, type = 'error') {
    loginMessage.textContent = message;
    loginMessage.className = `message-feedback ${type}-message`;
    loginMessage.classList.remove('hidden-start');
    console.error("Erro no login:", message);
}

/**
 * Reseta o estado da mensagem de feedback.
 */
function resetMessage() {
    loginMessage.textContent = '';
    loginMessage.classList.add('hidden-start');
}

/**
 * Garante que o username (apelido) termine em "@dominio.com" para usar o Firebase Auth.
 * Se o seu app armazena usuários no Firestore por 'username' e o Firebase Auth por 'email', 
 * este passo é crucial para mapear o username para um email fictício.
 * @param {string} username O apelido ou username digitado.
 * @returns {string} O email completo para login.
 */
function mapUsernameToEmail(username) {
    if (!username.includes('@')) {
        // ASSUME que todos os usuários são mapeados para um email no domínio do projeto
        return `${username.toLowerCase().trim()}@familiadefault.com`;
    }
    return username.toLowerCase().trim();
}

/**
 * Processa o evento de submissão do formulário de login.
 * @param {Event} e O evento de submissão.
 */
async function handleLogin(e) {
    e.preventDefault();
    resetMessage();

    if (!firebaseAuth || !firestore) {
        showMessage('Erro crítico: Firebase não inicializado.', 'error');
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const emailToLogin = mapUsernameToEmail(username);
    
    if (username === '' || password === '') {
        showMessage('Preencha todos os campos.', 'error');
        return;
    }
    
    // Desabilita o botão para evitar múltiplos envios
    const loginButton = loginForm.querySelector('button[type="submit"]');
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';


    try {
        // ETAPA 1: Autenticação via Firebase Auth (Email/Senha)
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(emailToLogin, password);
        const firebaseUser = userCredential.user;
        
        // ETAPA 2: Busca os dados adicionais do usuário no Firestore (usando o UID do Auth)
        const userDocRef = firestore.collection('users').doc(firebaseUser.uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            // Isso pode acontecer se o Firestore não tiver um documento user
            // correspondente ao UID do Auth. Desloga e reporta.
            await firebaseAuth.signOut();
            showMessage('Conta encontrada, mas perfil incompleto. Contate o administrador.', 'error');
            return;
        }

        const userData = userDoc.data();
        
        // Constrói o objeto de sessão (Username é o DOC ID, não o email do Auth)
        const userSession = {
            uid: firebaseUser.uid,
            username: userDoc.id, // O ID do documento users é o username/apelido
            nome: userData.nome,
            isAdmin: userData.isAdmin || false,
            // ... outros dados que você queira salvar na sessão
        };
        
        // ETAPA 3: Salva a sessão no LocalStorage
        localStorage.setItem('usuarioLogado', JSON.stringify(userSession));
        
        // ETAPA 4: Redireciona
        if (userSession.isAdmin) {
            window.location.href = 'painel-admin.html';
        } else {
            window.location.href = 'minhas-tarefas.html'; // Exemplo de página para usuários
        }

    } catch (error) {
        // Manipulação de Erros de Auth
        let errorMessage = 'Erro no login. Verifique as credenciais.';
        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Senha incorreta.';
        } else if (error.code === 'auth/user-not-found') {
            // Este erro é menos provável se você estiver usando o mapeamento de email
            errorMessage = 'Usuário não encontrado. Crie uma conta.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Formato de usuário/apelido inválido.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Erro de conexão. Verifique sua rede.';
        } else if (error.message.includes('Missing or insufficient permissions')) {
            // Este erro deve ser menos frequente se o processo Auth->Firestore for seguido
            errorMessage = 'Erro de permissão. Tente novamente ou contate o Admin.';
        }
        
        showMessage(errorMessage, 'error');
        loginButton.disabled = false;
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
    }
}

// Adiciona o listener ao formulário
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
} else {
    console.error("Formulário de login não encontrado.");
}