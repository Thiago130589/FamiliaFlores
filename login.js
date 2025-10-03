// O 'db' é uma variável global definida em firebase-init.js (Firestore)

document.addEventListener('DOMContentLoaded', () => {
    if (typeof db === 'undefined') {
        console.error("ERRO: A variável 'db' do Firestore não está definida. Verifique firebase-init.js e o carregamento dos scripts.");
        return;
    }

    const firestore = db;
    const USERS_COLLECTION = 'users';

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            loginUser();
        });
    }

    async function loginUser() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const messageEl = document.getElementById('login-message');

        messageEl.classList.add('hidden-start');
        messageEl.textContent = '';
        messageEl.style.color = '';

        if (!username || !password) {
            messageEl.textContent = 'Por favor, preencha todos os campos.';
            messageEl.classList.remove('hidden-start');
            return;
        }

        try {
            const userDoc = await firestore.collection(USERS_COLLECTION).doc(username).get(); 

            if (!userDoc.exists) {
                messageEl.textContent = 'Nome de usuário ou senha incorretos.';
                messageEl.classList.remove('hidden-start');
                return;
            }

            const userData = userDoc.data();

            // 2. Verifica a senha: AGORA usando 'userData.password'
            if (userData.password !== password) {
                messageEl.textContent = 'Nome de usuário ou senha incorretos.';
                messageEl.classList.remove('hidden-start');
                return;
            }

            // 3. Login bem-sucedido
            console.log("Login realizado com sucesso:", userData.nome);
            
            // CORREÇÃO AQUI: Salvar todos os dados de perfil, incluindo isAdmin
            const userToSave = {
                username: username,
                nome: userData.nome,
                // Garantir que os campos cruciais para o sistema sejam salvos:
                isAdmin: userData.isAdmin || false, // CRÍTICO: Para verificação de administrador
                perfil: userData.perfil || 'usuario',
                pontuacao: userData.pontuacao || 0,
                // Adicione outros campos necessários...
            };
            
            localStorage.setItem('usuarioLogado', JSON.stringify(userToSave));
            
            messageEl.textContent = 'Login bem-sucedido! Redirecionando...';
            messageEl.style.color = 'var(--success-color)';
            messageEl.classList.remove('hidden-start');

            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1000);

        } catch (error) {
            console.error("Erro no login:", error);
            let errorMessage = "Erro na comunicação com o servidor. Verifique o console.";
            
            if (error.message && (error.message.includes('permission denied') || error.message.includes('insufficient permissions'))) {
                 errorMessage = "Erro de permissão no Firebase. Verifique suas regras de segurança.";
            }
            
            messageEl.textContent = errorMessage;
            messageEl.classList.remove('hidden-start');
        }
    }
});