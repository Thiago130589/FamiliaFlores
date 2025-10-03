// Arquivo: script.js

let currentUser = null;

// =========================================================================
// 1. FUNÇÕES GLOBAIS DE UTILITÁRIO (Acessíveis por qualquer página)
// =========================================================================

/**
 * Retorna os dados do usuário logado do localStorage.
 * @returns {Object|null} Objeto do usuário ou null.
 */
function getUsuarioLogado() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        try {
            return JSON.parse(usuarioLogado);
        } catch (e) {
            console.error("Erro ao processar JSON do usuário:", e);
            return null;
        }
    }
    return null;
}

/**
 * Verifica se o usuário logado é administrador.
 * @returns {boolean} True se for admin, false caso contrário.
 */
function checkAdminAccess() {
    const userInfo = getUsuarioLogado();
    return userInfo && userInfo.isAdmin === true;
}

/**
 * Formata um valor numérico para o formato de moeda Real (BRL).
 * @param {number} valor
 * @returns {string} Valor formatado (Ex: R$ 5,00)
 */
function formatarMoeda(valor) {
    // Garante que o valor seja um número, com fallback para 0
    const numericValue = typeof valor === 'number' ? valor : 0;
    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


// =========================================================================
// 2. FUNÇÕES DE AUTENTICAÇÃO E VERIFICAÇÃO DE ESTADO
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

    // Lógica para as páginas PROTEGIDAS (como index.html, painel-admin.html, etc.)
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
            // Verifica acesso de admin se estiver em uma página de administração
            if (path.includes('admin') || path.includes('carteira') || path.includes('multas')) {
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

function logoutUser() {
    localStorage.removeItem('usuarioLogado');
    currentUser = null;
    window.location.href = 'login.html';
}

// =========================================================================
// 3. FUNÇÕES DE CARREGAMENTO DO DASHBOARD (index.html)
// =========================================================================

function loadDashboardData() {
    if (!currentUser) return;

    // 1. Detalhes do Perfil
    document.getElementById('user-name').textContent = currentUser.nome || 'Usuário';
    document.getElementById('user-username').textContent = `@${currentUser.username || 'usuario'}`;

    // 2. Foto do Perfil
    const userPhotoEl = document.getElementById('user-photo');
    if (userPhotoEl) {
        const defaultPath = 'imagens/default-avatar.png';
        const fallbackPath = 'default-avatar.png';
        
        userPhotoEl.src = currentUser.foto || defaultPath; 

        userPhotoEl.onerror = function() {
            // Tenta o caminho de fallback
            if (userPhotoEl.src.endsWith(defaultPath)) {
                userPhotoEl.src = fallbackPath;
            } else if (userPhotoEl.src.endsWith(fallbackPath)) {
                // Se falhar no fallback também, limpa a imagem para evitar loops
                userPhotoEl.src = ''; 
                console.error("ERRO 404: Imagem de perfil padrão não encontrada.");
            }
        };
    }

    // 3. Saldo/Pontuação (Prioriza 'saldo' para consistência com o Banco)
    const saldoEl = document.getElementById('user-saldo');
    if (saldoEl) {
        // Usa 'saldo' (do banco) ou 'pontuacao' (fallback)
        const currentBalance = currentUser.saldo !== undefined ? currentUser.saldo : currentUser.pontuacao || 0;
        
        saldoEl.textContent = formatarMoeda(currentBalance);
        
        // Aplica classe de cor
        if (currentBalance < 0) {
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
// 4. INICIALIZAÇÃO
// =========================================================================

// Chama a verificação de status imediatamente ao carregar o script
checkLoginStatus();

// Garante que a lógica do dashboard rode após o DOM ser totalmente carregado (útil com 'defer')
document.addEventListener('DOMContentLoaded', () => {
    // O loadDashboardData já foi chamado, esta é uma redundância segura
    if (window.location.pathname.includes('index.html') && currentUser) {
        loadDashboardData();
    }
});