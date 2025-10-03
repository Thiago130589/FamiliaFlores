// Arquivo: login.js

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a variável 'db' do Firestore foi definida
    if (typeof db === 'undefined') {
        console.error("ERRO CRÍTICO: O Firestore ('db') não está definido. Verifique o carregamento dos scripts no login.html e o firebase-init.js.");
        // Permite a execução para exibir a mensagem de erro no formulário
    }

    // Limpa o localStorage ao carregar a página de login para evitar loops
    localStorage.removeItem('usuarioLogado'); 

    // Garante que 'db' esteja definido ou seja null para evitar o ReferenceError
    const firestore = typeof db !== 'undefined' ? db : null;
    const USERS_COLLECTION = 'users';

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (firestore) {
                loginUser();
            } else {
                showMessage("Erro de inicialização: Banco de dados indisponível. Verifique o console.", true);
            }
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
        
        document.getElementById('login-message').classList.add('hidden-start');

        if (!username || !password) {
            showMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // 1. BUSCA O USUÁRIO pelo username
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
            
            // 2. VERIFICAÇÃO DE SENHA (AGORA SEM CRIPTOGRAFIA)
            // Compara a senha digitada (password) com a senha salva no DB (userData.password)
            if (userData.password !== password) {
                showMessage('Nome de usuário ou senha incorretos.');
                return;
            }

            // 3. Login bem-sucedido: Salva dados no localStorage
            const userToSave = {
                username: username,
                nome: userData.nome,
                uid: userDoc.id, 
                isAdmin: userData.isAdmin || false, 
                perfil: userData.perfil || 'usuario',
                pontuacao: userData.pontuacao || 0,
                foto: userData.foto || '', 
            };
            
            localStorage.setItem('usuarioLogado', JSON.stringify(userToSave));
            
            showMessage('Login bem-sucedido! Redirecionando...', false);

            // 4. Redireciona para o Dashboard
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 500); 

        } catch (error) {
            console.error("Erro no login:", error);
            showMessage("Erro na comunicação com o servidor. Detalhes no console.");
        }
    }
});