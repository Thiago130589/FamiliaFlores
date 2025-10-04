/**
 * Arquivo: login.js
 * Descrição: Lógica de autenticação do formulário de login.
 * Depende de: firebase-init.js (para 'auth' e 'db')
 */

// Acesso seguro às variáveis globais (db = Firestore, auth = FirebaseAuth)
// O firebase-init.js deve definir as variáveis globais 'db' e 'auth'
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
    if (type === 'error') {
        console.error("Erro no login:", message); 
    } else {
        console.log("Login:", message);
    }
}

/**
 * Reseta o estado da mensagem de feedback.
 */
function resetMessage() {
    loginMessage.textContent = '';
    loginMessage.classList.add('hidden-start');
}

/**
 * Mapeia o Apelido/Usuário para o formato de e-mail que o Firebase Auth requer.
 */
function mapUsernameToEmail(username) {
    if (!username.includes('@')) {
        // Este e-mail fictício DEVE ter sido usado durante o cadastro.
        return `${username.toLowerCase().trim()}@familiadefault.com`;
    }
    return username.toLowerCase().trim();
}

/**
 * Processa o evento de submissão do formulário de login.
 */
async function handleLogin(e) {
    e.preventDefault();
    resetMessage();

    if (!firebaseAuth || !firestore) {
        showMessage('Erro crítico: Firebase não inicializado. Verifique firebase-init.js.', 'error');
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
        // ETAPA 1: Autenticação via Firebase Auth (Verifica email/senha)
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(emailToLogin, password);
        const firebaseUser = userCredential.user;
        
        // ETAPA 2: Busca os dados adicionais do usuário no Firestore USANDO O USERNAME/APELIDO
        // Seu documento está nomeado pelo Apelido, não pelo UID.
        const userDocRef = firestore.collection('users').doc(username); 
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            // Se o documento Firestore não existir, desloga o Auth.
            await firebaseAuth.signOut();
            showMessage('Perfil de usuário não encontrado no banco de dados. Contate o administrador.', 'error');
            return;
        }

        const userData = userDoc.data();
        
        // Constrói o objeto de sessão
        const userSession = {
            uid: firebaseUser.uid, 
            username: userDoc.id, 
            nome: userData.nome || userDoc.id,
            foto: userData.foto || null,
            isAdmin: userData.isAdmin || false,
            pontuacao: userData.pontuacao || userData.saldo || 0,
            saldo: userData.saldo || userData.pontuacao || 0,
        };
        
        // ETAPA 3: Salva a sessão no LocalStorage
        localStorage.setItem('usuarioLogado', JSON.stringify(userSession));
        
        // ETAPA 4: Redireciona
        if (userSession.isAdmin) {
            window.location.href = 'painel-admin.html'; 
        } else {
            window.location.href = 'index.html'; 
        }

    } catch (error) {
        // Manipulação de Erros de Auth
        let errorMessage = 'Erro no login. Verifique o Apelido e Senha.';
        
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            errorMessage = 'Apelido ou Senha incorreta.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'O formato do Apelido/Usuário é inválido.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Erro de conexão com o servidor. Verifique sua rede.';
        } else if (error.message.includes('Missing or insufficient permissions')) {
            // Este erro é CRÍTICO e indica que as Regras do Firestore precisam ser atualizadas!
            errorMessage = 'Permissão negada ao buscar o perfil. Verifique as **Regras do Firestore** (Coleção users).';
            console.error("Erro Firebase de Permissão CRÍTICO:", error.message);
        } else {
            errorMessage = `Erro desconhecido: ${error.message}`;
            console.error("Erro de Login Desconhecido:", error);
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