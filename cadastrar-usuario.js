// Este script é carregado APÓS firebase-init.js, então 'db' (Firestore) estará disponível.

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se 'db' está disponível
    if (typeof db === 'undefined') {
        console.error("ERRO: O Firestore ('db') não está definido. Verifique a ordem dos scripts no HTML.");
        // A função registerUser() irá checar por 'firestore' nulo.
    }

    // Inicializa firestore com o objeto global 'db' (ou null se não estiver definido)
    const firestore = typeof db !== 'undefined' ? db : null;
    const USERS_COLLECTION = 'users';

    const registerForm = document.getElementById('register-form');
    const messageEl = document.getElementById('register-message');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Limpa a mensagem anterior
            messageEl.classList.add('hidden-start');
            messageEl.textContent = '';
            
            registerUser();
        });
    }

    async function registerUser() {
        const username = document.getElementById('register-username').value.trim();
        const nome = document.getElementById('register-nome').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('register-confirm-password').value.trim();
        const fotoInput = document.getElementById('register-foto-perfil');
        
        if (!firestore) {
            messageEl.textContent = 'Erro de inicialização do Firebase. Verifique o console.';
            messageEl.classList.remove('hidden-start');
            return;
        }

        if (!username || !nome || !password || !confirmPassword) {
            messageEl.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            messageEl.classList.remove('hidden-start');
            return;
        }

        if (password !== confirmPassword) {
            messageEl.textContent = 'As senhas não coincidem.';
            messageEl.classList.remove('hidden-start');
            return;
        }
        
        // Validação adicional do nome de usuário (sem espaços)
        if (username.includes(' ')) {
            messageEl.textContent = 'O nome de usuário não pode conter espaços.';
            messageEl.classList.remove('hidden-start');
            return;
        }

        try {
            // 1. Verifica se o nome de usuário (apelido) já existe
            const userDoc = await firestore.collection(USERS_COLLECTION).doc(username).get();

            if (userDoc.exists) {
                messageEl.textContent = `O nome de usuário "${username}" já está em uso.`;
                messageEl.classList.remove('hidden-start');
                return;
            }

            // 2. Processa a foto (Mantendo a lógica de Base64 simples)
            let fotoBase64 = null;
            if (fotoInput.files.length > 0) {
                fotoBase64 = await convertFileToBase64(fotoInput.files[0]);
            }
            
            // 3. Cria o objeto do novo usuário
            const newUser = {
                nome: nome,
                username: username,
                password: password, // ATENÇÃO: Use 'password' para ser consistente com o campo do Firestore
                foto: fotoBase64,
                perfil: 'usuario', // Padrão
                pontuacao: 0,
            };

            // 4. Salva o usuário no Firestore (usa o apelido como ID do documento)
            await firestore.collection(USERS_COLLECTION).doc(username).set(newUser);

            console.log("Usuário cadastrado com sucesso:", username);
            
            messageEl.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
            messageEl.style.color = 'var(--success-color)';
            messageEl.classList.remove('hidden-start');

            // Redireciona para o login após 1.5 segundos
            setTimeout(() => {
                window.location.href = 'login.html'; 
            }, 1500);

        } catch (error) {
            console.error("Erro no cadastro:", error);
            
            let errorMessage = `Erro ao cadastrar: ${error.message || 'Verifique o console.'}`;
            if (error.message && error.message.includes('permission denied')) {
                 errorMessage = "Erro de permissão. Verifique suas regras do Firestore (Security Rules).";
            }
            
            messageEl.textContent = errorMessage;
            messageEl.classList.remove('hidden-start');
        }
    }

    /**
     * Função auxiliar para converter o arquivo de foto em Base64
     * @param {File} file 
     * @returns {Promise<string|null>} Base64 string ou null
     */
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => {
                console.error("Erro ao ler arquivo:", error);
                // Retorna null em caso de erro para não bloquear o cadastro
                resolve(null); 
            };
            reader.readAsDataURL(file);
        });
    }
});