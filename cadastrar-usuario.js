// Este script é carregado APÓS firebase-init.js, então 'db' (Firestore) estará disponível.

document.addEventListener('DOMContentLoaded', () => {
    if (typeof db === 'undefined') {
        console.error("ERRO: O Firestore ('db') não está definido. Verifique a ordem dos scripts no HTML.");
    }

    const firestore = typeof db !== 'undefined' ? db : null;
    const USERS_COLLECTION = 'users';

    const registerForm = document.getElementById('register-form');
    const messageEl = document.getElementById('register-message');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
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
        
        if (username.includes(' ')) {
            messageEl.textContent = 'O nome de usuário não pode conter espaços.';
            messageEl.classList.remove('hidden-start');
            return;
        }

        try {
            const userDoc = await firestore.collection(USERS_COLLECTION).doc(username).get();

            if (userDoc.exists) {
                messageEl.textContent = `O nome de usuário "${username}" já está em uso.`;
                messageEl.classList.remove('hidden-start');
                return;
            }

            let fotoBase64 = null;
            if (fotoInput.files.length > 0) {
                fotoBase64 = await convertFileToBase64(fotoInput.files[0]);
            }
            
            // CRÍTICO: Incluir o campo isAdmin como false por padrão
            const newUser = {
                nome: nome,
                username: username,
                password: password, 
                foto: fotoBase64,
                perfil: 'usuario', 
                pontuacao: 0,
                isAdmin: false, // Adiciona o campo de permissão
            };

            await firestore.collection(USERS_COLLECTION).doc(username).set(newUser);

            console.log("Usuário cadastrado com sucesso:", username);
            
            messageEl.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
            messageEl.style.color = 'var(--success-color)';
            messageEl.classList.remove('hidden-start');

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
                resolve(null); 
            };
            reader.readAsDataURL(file);
        });
    }
});