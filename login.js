/**
 * Arquivo: login.js
 * Descrição: Lógica de autenticação do formulário de login.
 * Depende de: firebase-init.js (para 'auth' e 'db' [Firestore])
 */

// A variável 'db' (Firestore) e 'auth' (Firebase Auth) são definidas em firebase-init.js.
const firebaseAuth = typeof auth !== 'undefined' ? auth : null; // Usa 'auth' global

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('login-username');
const passwordInput = document.getElementById('login-password');
const loginMessage = document.getElementById('login-message');

/**
 * Exibe uma mensagem de feedback na tela.
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
    if (username.includes('@')) {
        return username.toLowerCase().trim();
    }
    // E-mail fictício usado no cadastro do Firebase Auth
    return `${username.toLowerCase().trim()}@familiadefault.com`;
}


/**
 * Processa o evento de submissão do formulário de login.
 */
async function handleLogin(e) {
    e.preventDefault();
    resetMessage();

    // CRÍTICO: Usa 'db' (a variável global do Firestore)
    if (!firebaseAuth || typeof db === 'undefined' || !db) {
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
    
    // Desabilita o botão
    const loginButton = loginForm.querySelector('button[type="submit"]');
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';


    try {
        // ETAPA 1: Autenticação via Firebase Auth
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(emailToLogin, password);
        const firebaseUser = userCredential.user;
        
        // ETAPA 2: Busca os dados adicionais do usuário no Firestore (usando 'db')
        const userDocRef = db.collection('users').doc(firebaseUser.email);
        
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            await firebaseAuth.signOut();
            showMessage('Perfil de usuário não encontrado no banco de dados. Contate o administrador.', 'error');
            return;
        }

        const userData = userDoc.data();
        
        // Constrói o objeto de sessão
        const userSession = {
            uid: firebaseUser.uid, 
            username: userData.username || userDoc.id, 
            nome: userData.nome || 'Usuário',
            foto: userData.foto || null,
            isAdmin: userData.isAdmin || false,
            pontuacao: userData.saldo || userData.pontuacao || 0, 
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
        
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Apelido ou Senha incorreta.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Erro de conexão com o servidor. Verifique sua rede.';
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