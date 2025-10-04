/**
 * Arquivo: login.js
 * Descrição: Lógica de autenticação do formulário de login.
 * Depende de: firebase-init.js (para 'auth' e 'db')
 */

// Acessa as variáveis globais injetadas por firebase-init.js. 
// Isso resolve o erro "firestore has already been declared" e garante que 'db' e 'auth' sejam acessíveis.
const firestore = typeof db !== 'undefined' ? db : null;
const firebaseAuth = typeof auth !== 'undefined' ? auth : null;

// Restante do código
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
 * Agora utiliza um domínio de teste mais genérico para evitar a confusão com o email gmail.
 */
function mapUsernameToEmail(username) {
    // Se o usuário digitou um email, usa o email.
    if (username.includes('@')) {
        return username.toLowerCase().trim();
    }
    
    // Se digitou apenas o apelido, assume-se o formato usado no cadastro.
    // **Atenção:** Se o usuário real for thiagoferreira2flores@gmail.com, a regra deve ser ajustada.
    // Pelo que vi nas imagens, você está usando o email completo para login.
    return `${username.toLowerCase().trim()}@familiadefault.com`;
}


/**
 * Processa o evento de submissão do formulário de login.
 */
async function handleLogin(e) {
    e.preventDefault();
    resetMessage();

    // Verificação de inicialização CRÍTICA
    if (!firebaseAuth || !firestore) {
        showMessage('Erro crítico: Firebase não inicializado. Verifique firebase-init.js.', 'error');
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    // Se o usuário usa o email completo, o mapUsernameToEmail retorna o email.
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
        
        // CORREÇÃO CRÍTICA: Pega o apelido do usuário para buscar o documento.
        // Se o login foi feito com o e-mail completo, precisamos extrair o apelido (ID do Documento).
        // Se o email completo for o ID do documento, usamos o email.

        // MUDANÇA AQUI: Usa o EMAIL COMPLETO do Firebase Auth para buscar no Firestore.
        // O Firestore exige que a permissão de leitura seja concedida por uma regra.
        const userDocRef = firestore.collection('users').doc(firebaseUser.email); // CORRIGIDO: Usa o email
        
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
            // O username aqui deve ser o valor que você usa para exibir na tela (o 'apelido' ou 'nome').
            // Usarei o ID do Documento (o email) como identificador principal, mas o nome real se existir.
            username: userDoc.id, // ID do Documento (email completo, ex: thiagoferreira2flores@gmail.com)
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
        
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Apelido ou Senha incorreta.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'O formato do Apelido/Usuário é inválido.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Erro de conexão com o servidor. Verifique sua rede.';
        } else if (error.code === 'auth/internal-error' || error.message.includes('API key not valid') || error.message.includes('CONFIGURATION_NOT_FOUND')) {
             // Tratamento para o ERRO CRÍTICO da Chave de API
            errorMessage = 'Erro interno do servidor (400 Bad Request). Verifique se a **API Key** no `firebase-init.js` está correta.';
            console.error("Erro Firebase de Chave de API CRÍTICO:", error.message);
        } else if (error.message.includes('Missing or insufficient permissions')) {
            // Este erro indica que as Regras do Firestore precisam ser atualizadas!
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