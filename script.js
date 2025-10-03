// Arquivo: script.js

let currentUser = null;

// =========================================================================
// 1. FUNÇÕES DE AUTENTICAÇÃO E VERIFICAÇÃO DE ESTADO
// =========================================================================

function checkLoginStatus() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const path = window.location.pathname;

    // Se estiver em telas de AUTH (login/cadastro), redireciona se já estiver logado.
    if (path.includes('login.html') || path.includes('cadastrar-usuario.html')) {
        if (usuarioLogado) {
            // Pequeno delay para evitar o "flickering"
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 10);
        }
        return; 
    }

    // Lógica para as páginas PROTEGIDAS (como index.html)
    if (!usuarioLogado) {
        console.log("Usuário não logado em página protegida. Redirecionando para login.");
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 10); 
    } else {
        try {
            currentUser = JSON.parse(usuarioLogado);
            console.log("Dashboard carregado para:", currentUser.username, "(Admin:", currentUser.isAdmin, ")");
            
            // Se estiver no Dashboard, carrega os dados
            if (path.includes('index.html')) {
                loadDashboardData();
            }
            
        } catch (e) {
            console.error("Erro ao processar dados do usuário, forçando logout:", e);
            logoutUser();
        }
    }
}

function logoutUser() {
    localStorage.removeItem('usuarioLogado');
    currentUser = null;
    window.location.href = 'login.html';
}

// =========================================================================
// 2. FUNÇÕES DE CARREGAMENTO DO DASHBOARD (index.html)
// =========================================================================

function loadDashboardData() {
    if (!currentUser) return;

    // 1. Detalhes do Perfil
    document.getElementById('user-name').textContent = currentUser.nome || 'Usuário';
    document.getElementById('user-username').textContent = `@${currentUser.username || 'usuario'}`;

    // 2. Foto do Perfil
    const userPhotoEl = document.getElementById('user-photo');
    if (userPhotoEl) {
        // Lógica de fallback para evitar erros 404
        const defaultPath = 'imagens/default-avatar.png';
        const fallbackPath = 'default-avatar.png';
        
        userPhotoEl.src = currentUser.foto || defaultPath; 

        userPhotoEl.onerror = function() {
            if (userPhotoEl.src.endsWith(defaultPath)) {
                userPhotoEl.src = fallbackPath;
            } else if (userPhotoEl.src.endsWith(fallbackPath)) {
                userPhotoEl.src = ''; 
                console.error("ERRO 404: Imagem de perfil padrão não encontrada.");
            }
        };
    }

    // 3. Saldo/Pontuação
    const saldoEl = document.getElementById('user-saldo');
    if (saldoEl) {
        const saldoFormatado = (currentUser.pontuacao || 0).toFixed(2).replace('.', ',');
        saldoEl.textContent = `R$ ${saldoFormatado}`;
        
        // Aplica classe de cor
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
    const adminBadge = document.getElementById('user-role'); // Onde aparece "ADMIN" no perfil
    const adminButton = document.getElementById('admin-button'); // O link "Painel Admin"

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

// Chama a verificação de status imediatamente ao carregar o script
checkLoginStatus();

// Garante que a lógica do dashboard rode após o DOM ser totalmente carregado (útil com 'defer')
document.addEventListener('DOMContentLoaded', () => {
    // Se a página for o dashboard e o usuário estiver definido, garante o carregamento
    if (window.location.pathname.includes('index.html') && currentUser) {
        // O loadDashboardData já foi chamado, esta é uma redundância segura
        loadDashboardData();
    }
});