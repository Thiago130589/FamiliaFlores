document.addEventListener('DOMContentLoaded', () => {
    // Acessa as variáveis globais 'db' (Firestore) e 'auth' (Firebase Auth)
    const firebaseAuth = typeof auth !== 'undefined' ? auth : null; 
    const USERS_COLLECTION = 'users';

    // CRÍTICO: Usa 'db' (a variável global do Firestore)
    if (typeof db === 'undefined' || !db || !firebaseAuth) { 
        console.error("ERRO CRÍTICO: Firebase (Firestore ou Auth) não está definido. Verifique a ordem dos scripts no HTML.");
    }

    const registerForm = document.getElementById('register-form');
    const messageEl = document.getElementById('register-message');
    
    // -------------------------------------------------------------------------
    // Funções Auxiliares
    // -------------------------------------------------------------------------

    /**
     * Mapeia o Apelido/Usuário para o formato de e-mail que o Firebase Auth requer.
     */
    function mapUsernameToEmail(username) {
        // E-mail fictício usado no cadastro do Firebase Auth
        return `${username.toLowerCase().trim()}@familiadefault.com`;
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

    // -------------------------------------------------------------------------
    // Lógica Principal de Cadastro
    // -------------------------------------------------------------------------
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            messageEl.classList.add('hidden-start');
            messageEl.textContent = '';
            
            registerUser();
        });
    }

    async function registerUser() {
        // 1. Coleta e Validação Básica
        const username = document.getElementById('register-username').value.trim();
        const nome = document.getElementById('register-nome').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('register-confirm-password').value.trim();
        const fotoInput = document.getElementById('register-foto-perfil');
        
        if (typeof db === 'undefined' || !db || !firebaseAuth) {
            messageEl.textContent = 'Erro de inicialização do Firebase. Verifique firebase-init.js.';
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

        // Mapeia o apelido para o formato de e-mail
        const emailToRegister = mapUsernameToEmail(username);

        try {
            
            // 2. VERIFICAÇÃO DE DUPLICIDADE (Usando 'db')
            const userDocCheck = await db.collection(USERS_COLLECTION).doc(emailToRegister).get();

            if (userDocCheck.exists) {
                messageEl.textContent = `O nome de usuário "${username}" já está em uso.`;
                messageEl.classList.remove('hidden-start');
                return;
            }

            // 3. CRIAÇÃO DE CONTA NO FIREBASE AUTH
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(emailToRegister, password);
            const firebaseUser = userCredential.user;
            console.log("Conta Auth criada com sucesso para:", emailToRegister);
            
            // 4. PREPARAÇÃO DA FOTO
            let fotoBase64 = null;
            if (fotoInput.files.length > 0) {
                fotoBase64 = await convertFileToBase64(fotoInput.files[0]);
            }
            
            // 5. CRIAÇÃO DO DOCUMENTO NO FIRESTORE (Usando 'db')
            const newUserDoc = {
                uid: firebaseUser.uid,
                nome: nome,
                username: username,
                foto: fotoBase64,
                pontuacao: 0,
                isAdmin: false, 
            };

            await db.collection(USERS_COLLECTION).doc(emailToRegister).set(newUserDoc);
            console.log("Documento Firestore criado com sucesso para:", emailToRegister);

            // 6. SUCCESSO
            messageEl.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
            messageEl.classList.remove('hidden-start');
            messageEl.classList.remove('error-message');
            messageEl.style.color = 'var(--success-color, green)'; 

            setTimeout(() => {
                window.location.href = 'login.html'; 
            }, 2000);

        } catch (error) {
            console.error("Erro no cadastro:", error);
            
            let errorMessage = `Erro ao cadastrar: ${error.message || 'Verifique o console.'}`;
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Este apelido já está em uso.";
            } else if (error.code === 'auth/weak-password') {
                 errorMessage = "A senha deve ter pelo menos 6 caracteres.";
            } 
            
            messageEl.textContent = errorMessage;
            messageEl.classList.add('error-message');
            messageEl.classList.remove('hidden-start');
        }
    }
});