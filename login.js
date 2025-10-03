// Arquivo: login.js

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a variável 'db' do Firestore e CryptoJS foram definidos
    // O CryptoJS foi adicionado ao <head> do login.html, mas verificamos aqui.
    if (typeof db === 'undefined' || typeof CryptoJS === 'undefined') {
        console.error("ERRO CRÍTICO: O Firestore ('db') ou a biblioteca Crypto-JS ('CryptoJS') não estão definidos. Verifique o carregamento dos scripts no login.html e o firebase-init.js.");
        return;
    }

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
        
        // ... (limpeza de mensagem)

        if (!username || !password) {
            showMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // 1. BUSCA O USUÁRIO
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
                // Se cair aqui, a senha não bateu.
                showMessage('Nome de usuário ou senha incorretos.');
                return;
            }

            // 4. Login bem-sucedido: Salva dados no localStorage
            const userToSave = {
                username: username,
                nome: userData.nome,
                uid: userDoc.id, 
                isAdmin: userData.isAdmin || false, 
                perfil: userData.perfil || 'usuario',
                pontuacao: userData.pontuacao || 0,
                // Garantimos que a foto seja um caminho vazio ou o valor do DB
                foto: userData.foto || '', 
            };
            
            localStorage.setItem('usuarioLogado', JSON.stringify(userToSave));
            
            showMessage('Login bem-sucedido! Redirecionando...', false);

            // 5. Redireciona
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 500); 

        } catch (error) {
            console.error("Erro no login:", error);
            showMessage("Erro na comunicação com o servidor.");
        }
    }
});