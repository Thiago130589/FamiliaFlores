// Arquivo: script.js

// Variável global para armazenar os dados do usuário logado
let currentUser = null;

// =========================================================================
// 1. FUNÇÕES DE AUTENTICAÇÃO E VERIFICAÇÃO DE ESTADO
// =========================================================================

/**
 * Verifica se há um usuário logado no localStorage e redireciona se necessário.
 */
function checkLoginStatus() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    // ATENÇÃO: Se este script está sendo carregado, a página é PROTEGIDA.
    
    if (!usuarioLogado) {
        // Se NÃO houver dados de usuário, redireciona IMEDIATAMENTE para o login.
        console.log("Usuário não logado em página protegida. Redirecionando para login.");
        
        // CORREÇÃO: Usamos setTimeout=0 para garantir que o redirecionamento 
        // seja a última coisa a acontecer, evitando o loop de carregamento.
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 0); 
        
        return;
    } else {
        // Usuário logado: Carrega os dados e inicializa o Dashboard.
        try {
            currentUser = JSON.parse(usuarioLogado);
            console.log("Usuário logado encontrado:", currentUser.username);
            
            // Chama a função que carrega os dados na tela (apenas para o index.html)
            if (window.location.pathname.includes('index.html')) {
                loadDashboardData();
            }
            
        } catch (e) {
            console.error("Erro ao processar dados do usuário, forçando logout:", e);
            // Se os dados estiverem corrompidos, força o logout.
            logoutUser();
        }
    }
}

/**
 * Função de Logout: Remove os dados do localStorage e redireciona.
 */
function logoutUser() {
    localStorage.removeItem('usuarioLogado');
    currentUser = null;
    // Redireciona para o login.
    window.location.href = 'login.html';
}

// =========================================================================
// 2. FUNÇÕES DE CARREGAMENTO DO DASHBOARD (index.html)
// =========================================================================

/**
 * Carrega e exibe os dados do usuário na tela do Dashboard.
 */
function loadDashboardData() {
    if (!currentUser) return;

    // 1. Detalhes do Perfil
    document.getElementById('user-name').textContent = currentUser.nome || 'Usuário';
    document.getElementById('user-username').textContent = `@${currentUser.username || 'usuario'}`;

    // 2. Foto do Perfil
    const userPhotoEl = document.getElementById('user-photo');
    if (userPhotoEl) {
        // Se tiver foto no Firestore, usa. Senão, usa um avatar padrão.
        userPhotoEl.src = currentUser.foto || 'imagens/default-avatar.png'; 
    }

    // 3. Saldo/Pontuação
    const saldoEl = document.getElementById('user-saldo');
    if (saldoEl) {
        const saldoFormatado = (currentUser.pontuacao || 0).toFixed(2).replace('.', ',');
        saldoEl.textContent = `R$ ${saldoFormatado}`;
        // Lógica para cor do saldo (opcional)
        if (currentUser.pontuacao < 0) {
            saldoEl.classList.add('saldo-negativo');
            saldoEl.classList.remove('saldo-positivo');
        } else {
            saldoEl.classList.add('saldo-positivo');
            saldoEl.classList.remove('saldo-negativo');
        }
    }

    // 4. Exibir/Ocultar elementos de ADMIN
    const isAdmin = currentUser.isAdmin === true;
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
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
}

// =========================================================================
// 3. INICIALIZAÇÃO
// =========================================================================

// Chama a verificação de login imediatamente ao carregar o script
checkLoginStatus();

// Adiciona listener para garantir que o DOM esteja totalmente carregado antes de manipular
document.addEventListener('DOMContentLoaded', () => {
    // Se estiver no Dashboard (index.html), recarrega os dados (redundância segura)
    if (window.location.pathname.includes('index.html') && currentUser) {
        loadDashboardData();
    }
});