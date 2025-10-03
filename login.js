// O 'db' é uma variável global definida em firebase-init.js (Firestore)

document.addEventListener('DOMContentLoaded', () => {
    // É uma boa prática verificar se 'db' está disponível
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

        // Resetar a mensagem de erro
        messageEl.classList.add('hidden-start');
        messageEl.textContent = '';
        messageEl.style.color = ''; // Limpar cor de sucesso

        if (!username || !password) {
            messageEl.textContent = 'Por favor, preencha todos os campos.';
            messageEl.classList.remove('hidden-start');
            return;
        }

        try {
            // 1. Busca o documento do usuário pelo nome de usuário (que é o ID do documento)
            const userDoc = await firestore.collection(USERS_COLLECTION).doc(username).get(); 

            if (!userDoc.exists) {
                messageEl.textContent = 'Nome de usuário ou senha incorretos.';
                messageEl.classList.remove('hidden-start');
                return;
            }

            const userData = userDoc.data();

            // 2. Verifica a senha: CORREÇÃO DA CHAVE 'password' (estava 'senha')
            if (userData.password !== password) {
                messageEl.textContent = 'Nome de usuário ou senha incorretos.';
                messageEl.classList.remove('hidden-start');
                return;
            }

            // 3. Login bem-sucedido
            console.log("Login realizado com sucesso:", userData.nome);
            
            // Salvar o objeto JSON na chave 'usuarioLogado' para ser lido pelo script.js
            const userToSave = {
                username: username, // O apelido
                nome: userData.nome,  // Nome completo
                // Adicione outros dados necessários para a sessão, como avatar, perfil, etc.
            };
            
            // Salva o objeto como JSON
            localStorage.setItem('usuarioLogado', JSON.stringify(userToSave));
            
            messageEl.textContent = 'Login bem-sucedido! Redirecionando...';
            messageEl.style.color = 'var(--success-color)';
            messageEl.classList.remove('hidden-start');

            // Redireciona para o Dashboard
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1000);

        } catch (error) {
            console.error("Erro no login:", error);
            let errorMessage = "Erro na comunicação com o servidor. Verifique o console.";
            
            // Mensagem de erro para regras de segurança
            if (error.message && (error.message.includes('permission denied') || error.message.includes('insufficient permissions'))) {
                 errorMessage = "Erro de permissão no Firebase. Verifique suas regras de segurança.";
            }
            
            messageEl.textContent = errorMessage;
            messageEl.classList.remove('hidden-start');
        }
    }
});