let currentUser = null;

// =========================================================================
// 0. CONFIGURAÇÃO DO FIREBASE (Variáveis Globais)
// =========================================================================
const firebaseAuth = typeof auth !== 'undefined' ? auth : null;
const firestore = typeof db !== 'undefined' ? db : null;


// =========================================================================
// 1. FUNÇÕES GLOBAIS DE UTILITÁRIO (Acessíveis por qualquer página)
// =========================================================================

/**
 * Retorna os dados do usuário logado do localStorage.
 */
function getUsuarioLogado() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        try {
            return JSON.parse(usuarioLogado);
        } catch (e) {
            console.error("Erro ao processar JSON do usuário:", e);
            localStorage.removeItem('usuarioLogado');
            return null;
        }
    }
    return null;
}

/**
 * Verifica se o usuário logado é administrador.
 */
function checkAdminAccess() {
    const userInfo = currentUser || getUsuarioLogado();
    return userInfo && userInfo.isAdmin === true;
}

/**
 * Formata um valor numérico para o formato de moeda Real (BRL).
 */
function formatarMoeda(valor) {
    const numericValue = typeof valor === 'number' ? valor : parseFloat(valor) || 0;
    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


// =========================================================================
// 2. FUNÇÕES DE AUTENTICAÇÃO E VERIFICAÇÃO DE ESTADO
// =========================================================================

function checkLoginStatus() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const path = window.location.pathname;

    // Se estiver em telas de AUTH, redireciona se já estiver logado.
    if (path.includes('login.html') || path.includes('cadastrar-usuario.html')) {
        if (usuarioLogado) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 10);
        }
        return; 
    }

    // Lógica para as páginas PROTEGIDAS 
    if (!usuarioLogado) {
        console.log("Usuário não logado em página protegida. Redirecionando para login.");
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 10); 
    } else {
        try {
            currentUser = JSON.parse(usuarioLogado);
            console.log("Usuário logado:", currentUser.username, "(Admin:", currentUser.isAdmin, ")");
            
            // Se estiver no Dashboard, carrega os dados
            if (path.includes('index.html')) {
                loadDashboardData();
            }

            // Verifica acesso de admin (ex: painel-admin.html)
            if (path.includes('painel-admin.html')) {
                if (!checkAdminAccess()) {
                    alert("Acesso restrito a administradores.");
                    window.location.href = 'index.html';
                }
            }
            
        } catch (e) {
            console.error("Erro ao processar dados do usuário, forçando logout:", e);
            logoutUser();
        }
    }
}

async function logoutUser() {
    // 1. Tenta deslogar do Firebase Auth
    if (firebaseAuth) {
        try {
            await firebaseAuth.signOut();
            console.log("Logout do Firebase Auth bem-sucedido.");
        } catch (error) {
            console.error("Erro ao tentar logout do Firebase:", error);
        }
    }
    
    // 2. Limpa a sessão local e redireciona
    localStorage.removeItem('usuarioLogado');
    currentUser = null;
    window.location.href = 'login.html';
}

// =========================================================================
// 3. FUNÇÕES DE BUSCA DE DADOS (Firestore)
// =========================================================================

/**
 * Busca o saldo/pontuação mais recente no Firestore.
 */
async function getSaldoFromFirestore(userEmailId) {
    if (!firestore) {
        console.error("Firestore (db) não está inicializado.");
        return 0;
    }
    
    try {
        const userDoc = await firestore.collection('users').doc(userEmailId).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            return userData.saldo !== undefined ? userData.saldo : userData.pontuacao || 0;
        }
        return 0;
    } catch (error) {
        console.error("Erro ao buscar saldo no Firestore:", error);
        return 0;
    }
}


/**
 * Função para carregar dados adicionais do Dashboard (Saldo mais recente).
 */
async function loadDashboardDataFromDatabase() {
    // O ID do documento no Firestore é o email mapeado (ex: 'apelido@familiadefault.com')
    if (!currentUser || !currentUser.username) { 
        console.warn("Não foi possível carregar dados adicionais: Username ausente.");
        return;
    }
    const userEmailId = `${currentUser.username}@familiadefault.com`;

    try {
        const saldoAtualizado = await getSaldoFromFirestore(userEmailId);
        
        // Atualiza o objeto currentUser e o localStorage
        currentUser.saldo = saldoAtualizado;
        currentUser.pontuacao = saldoAtualizado; 
        localStorage.setItem('usuarioLogado', JSON.stringify(currentUser)); 
        
        renderDashboardData(currentUser);

    } catch (error) {
        console.error("Erro ao buscar dados do Firestore para o Dashboard:", error);
    }
}


// =========================================================================
// 4. FUNÇÕES DE CARREGAMENTO DO DASHBOARD (index.html)
// =========================================================================

const DEFAULT_AVATAR_PATH = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#32c74d"/><text x="50" y="65" font-family="Arial, sans-serif" font-size="50" fill="#ffffff" text-anchor="middle">U</text></svg>';


function loadDashboardData() {
    if (!currentUser) return;

    // 1. Renderiza os dados INICIAIS (do localStorage)
    renderDashboardData(currentUser);

    // 2. Inicia a busca por dados mais recentes/dinâmicos no banco de dados
    loadDashboardDataFromDatabase();
}

function renderDashboardData(userData) {
    if (!userData) return;

    // 1. Detalhes do Perfil
    document.getElementById('user-name').textContent = userData.nome || 'Usuário';
    document.getElementById('user-username').textContent = `@${userData.username || 'usuario'}`;

    // 2. Foto do Perfil
    const userPhotoEl = document.getElementById('user-photo');
    if (userPhotoEl) {
        const photoSource = userData.foto && userData.foto.startsWith('data:image/') ? userData.foto : DEFAULT_AVATAR_PATH;
        userPhotoEl.src = photoSource; 

        userPhotoEl.onerror = function() {
            // Se falhar, usa o SVG padrão para evitar erro 404
            userPhotoEl.src = DEFAULT_AVATAR_PATH;
        };
    }

    // 3. Saldo/Pontuação
    const saldoEl = document.getElementById('user-saldo');
    if (saldoEl) {
        const currentBalance = userData.saldo !== undefined ? userData.saldo : userData.pontuacao || 0;
        
        saldoEl.textContent = formatarMoeda(currentBalance);
        
        if (currentBalance < 0) {
            saldoEl.classList.add('saldo-negativo');
            saldoEl.classList.remove('saldo-positivo');
        } else {
            saldoEl.classList.add('saldo-positivo');
            saldoEl.classList.remove('saldo-negativo');
        }
    }

    // 4. Exibir/Ocultar elementos de ADMIN
    const isAdmin = userData.isAdmin === true;
    const adminBadge = document.getElementById('user-role'); 
    const adminButton = document.getElementById('admin-button'); 

    if (adminBadge) {
        if (isAdmin) {
            adminBadge.classList.remove('hidden-start');
        } else {
            adminBadge.classList.add('hidden-start');
        }
    }

    if (adminButton) {
        if (isAdmin) {
            adminButton.classList.remove('hidden-start');
        } else {
            adminButton.classList.add('hidden-start');
        }
    }

    // 5. Configurar botão de Logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
        logoutButton.addEventListener('click', logoutUser);
        logoutButton.setAttribute('data-listener-attached', 'true');
    }
}


// =========================================================================
// 5. INICIALIZAÇÃO
// =========================================================================

// Chama a verificação de status imediatamente ao carregar o script
checkLoginStatus();