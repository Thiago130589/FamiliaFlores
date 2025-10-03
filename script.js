// Arquivo: script.js

let currentUser = null;

// =========================================================================
// 1. FUNÇÕES DE AUTENTICAÇÃO E VERIFICAÇÃO DE ESTADO
// =========================================================================

function checkLoginStatus() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const path = window.location.pathname;

    // Se estiver em telas de AUTH, garante que o usuário logado seja redirecionado para o dashboard.
    if (path.includes('login.html') || path.includes('cadastrar-usuario.html')) {
        if (usuarioLogado) {
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
        // CORREÇÃO DE CAMINHO DE IMAGEM: 
        // 1. Tenta carregar a foto do DB
        // 2. Se falhar, tenta o caminho 'imagens/default-avatar.png'
        // 3. Se ainda falhar (erro 404), usa um caminho mais simples 'default-avatar.png'
        const defaultPath = 'imagens/default-avatar.png';
        const fallbackPath = 'default-avatar.png'; // Caminho de fallback caso o 404 persista
        
        userPhotoEl.src = currentUser.foto || defaultPath; 

        // Adiciona um listener para lidar com o erro 404 de forma suave
        userPhotoEl.onerror = function() {
            // Tenta o caminho de fallback se a primeira tentativa falhar
            if (userPhotoEl.src.endsWith(defaultPath)) {
                userPhotoEl.src = fallbackPath;
            } else if (userPhotoEl.src.endsWith(fallbackPath)) {
                // Se o fallback também falhar, usa um URL vazio para não quebrar.
                userPhotoEl.src = ''; 
                console.error("ERRO 404 CRÍTICO: A imagem de perfil padrão não pôde ser carregada em nenhum caminho. Verifique a pasta/nome do arquivo.");
            }
        };
    }

    // 3. Saldo/Pontuação
    const saldoEl = document.getElementById('user-saldo');
    if (saldoEl) {
        const saldoFormatado = (currentUser.pontuacao || 0).toFixed(2).replace('.', ',');
        saldoEl.textContent = `R$ ${saldoFormatado}`;
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

checkLoginStatus();

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') && currentUser) {
        loadDashboardData();
    }
});