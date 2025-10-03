// Arquivo: login.js

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a variável 'db' do Firestore foi definida (em firebase-init.js)
    if (typeof db === 'undefined' || typeof CryptoJS === 'undefined') {
        console.error("ERRO: O Firestore ('db') ou a biblioteca Crypto-JS ('CryptoJS') não estão definidos. Verifique o carregamento dos scripts.");
        return;
    }

    // Limpa qualquer estado de login anterior ao iniciar na página de login.
    // ISSO É INTENCIONAL e CORRETO aqui para garantir que a sessão antiga seja apagada.
    localStorage.removeItem('usuarioLogado'); 

    const firestore = db;
    const USERS_COLLECTION = 'users';

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            loginUser();
        });
    }

    // Função auxiliar para mostrar mensagens
    const showMessage = (message, isError = true) => {
        const messageEl = document.getElementById('login-message');
        messageEl.textContent = message;
        messageEl.style.color = isError ? 'var(--danger-color)' : 'var(--success-color)';
        messageEl.style.borderColor = isError ? 'var(--danger-color)' : 'var(--success-color)';
        messageEl.classList.remove('hidden-start');
    };

    async function loginUser() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        const messageEl = document.getElementById('login-message');
        messageEl.classList.add('hidden-start');
        messageEl.textContent = '';

        if (!username || !password) {
            showMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // 1. BUSCA O USUÁRIO PELO CAMPO 'username' (Apelido)
            const snapshot = await firestore.collection(USERS_COLLECTION)
                .where('username', '==', username)
                .limit(1)
                .get(); 

            if (snapshot.empty) {
                showMessage('Nome de usuário ou senha incorretos.');
                return;
            }

            const userDoc = snapshot.docs[0];
            const userData = userDoc.data();
            
            // 2. CRIPTOGRAFA A SENHA fornecida para comparação (SHA-256)
            const hashedPassword = CryptoJS.SHA256(password).toString();

            // 3. Verifica a senha Cifrada
            if (userData.password !== hashedPassword) {
                showMessage('Nome de usuário ou senha incorretos.');
                return;
            }

            // 4. Login bem-sucedido: Salva dados no localStorage
            console.log("Login realizado com sucesso:", userData.nome);
            
            const userToSave = {
                username: username,
                nome: userData.nome,
                uid: userDoc.id, // ID do documento do Firestore
                isAdmin: userData.isAdmin || false, 
                perfil: userData.perfil || 'usuario',
                pontuacao: userData.pontuacao || 0,
                foto: userData.foto || null,
            };
            
            localStorage.setItem('usuarioLogado', JSON.stringify(userToSave));
            
            showMessage('Login bem-sucedido! Redirecionando...', false);

            // 5. Redireciona
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 500); // Tempo reduzido para 500ms para ser mais rápido

        } catch (error) {
            console.error("Erro no login:", error);
            let errorMessage = "Erro na comunicação com o servidor. Verifique o console ou as regras do Firestore.";
            
            showMessage(errorMessage);
        }
    }
});