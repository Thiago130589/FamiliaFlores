let currentUser = null;

// =========================================================================
// 0. CONFIGURAÇÃO DO FIREBASE (Exemplo)
// =========================================================================
// Assumindo que você inicializou o Firebase e o Firestore em algum lugar,
// e a variável 'db' está disponível. Exemplo:
// const db = firebase.firestore();


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
            
            // Se estiver no Dashboard, carrega os dados (AJUSTE DE SINCRONIZAÇÃO)
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
// 3. FUNÇÕES DE BUSCA DE DADOS (Simulação de Firestore)
// =========================================================================

/**
 * SIMULAÇÃO: Busca o saldo/pontuação mais recente no Firestore.
 * Em um app real, o 'currentUser' deveria ser atualizado com este dado.
 * @param {string} userId - ID do usuário.
 * @returns {Promise<number>} O saldo atualizado.
 */
async function getSaldoFromFirestore(userId) {
    // Implementação real do Firestore seria:
    // const userDoc = await db.collection('users').doc(userId).get();
    // return userDoc.exists ? userDoc.data().saldo : 0;
    
    console.log(`Simulando busca de saldo para o usuário ID: ${userId}...`);
    
    // Simula um delay e um retorno de dado (ex: um saldo de 1500)
    return new Promise(resolve => setTimeout(() => resolve(1500.75), 500)); 
}


/**
 * Função para carregar dados adicionais do Dashboard que NÃO estão no localStorage.
 */
async function loadDashboardDataFromDatabase() {
    if (!currentUser || !currentUser.uid) { // Assume que o Firestore usa 'uid'
        console.warn("Não foi possível carregar dados adicionais: UID do usuário ausente.");
        return;
    }

    try {
        const saldoAtualizado = await getSaldoFromFirestore(currentUser.uid);
        
        // Atualiza o objeto currentUser e o localStorage APENAS com o saldo (ou outros campos dinâmicos)
        currentUser.saldo = saldoAtualizado;
        // Não é recomendado salvar todo o objeto de volta, mas para manter a consistência...
        localStorage.setItem('usuarioLogado', JSON.stringify(currentUser)); 
        
        // Chama a função de exibição de dados para renderizar os novos valores
        renderDashboardData(currentUser);

    } catch (error) {
        console.error("Erro ao buscar dados do Firestore para o Dashboard:", error);
    }
}


// =========================================================================
// 4. FUNÇÕES DE CARREGAMENTO DO DASHBOARD (index.html)
// =========================================================================

// Função principal de carregamento que também chama a busca no banco (se necessário)
function loadDashboardData() {
    if (!currentUser) return;

    // 1. Renderiza os dados INICIAIS (do localStorage)
    renderDashboardData(currentUser);

    // 2. Inicia a busca por dados mais recentes/dinâmicos no "banco de dados"
    loadDashboardDataFromDatabase();
}

// Função de renderização pura (separa lógica de busca da lógica de DOM)
function renderDashboardData(userData) {
    if (!userData) return;

    // 1. Detalhes do Perfil
    document.getElementById('user-name').textContent = userData.nome || 'Usuário';
    document.getElementById('user-username').textContent = `@${userData.username || 'usuario'}`;

    // 2. Foto do Perfil
    const userPhotoEl = document.getElementById('user-photo');
    if (userPhotoEl) {
        const defaultPath = 'imagens/default-avatar.png';
        const fallbackPath = 'default-avatar.png';
        
        userPhotoEl.src = userData.foto || defaultPath; 

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
        const currentBalance = userData.saldo !== undefined ? userData.saldo : userData.pontuacao || 0;
        
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

    // 5. Configurar botão de Logout (garantindo que seja anexado apenas uma vez)
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
// Esta é a primeira ação crucial: verificar autenticação e definir 'currentUser'.
checkLoginStatus();

// Garante que a lógica do dashboard rode APÓS o DOM ser totalmente carregado.
// A função 'checkLoginStatus' já fez a maior parte do trabalho, este bloco
// é mais uma garantia e não será estritamente necessário se o script estiver
// carregado com 'defer' no HTML, mas é uma boa prática.
document.addEventListener('DOMContentLoaded', () => {
    // Se o usuário já estiver logado (e currentUser não for null) e estivermos no index.html,
    // garantimos o carregamento de dados (incluindo a busca no banco).
    if (window.location.pathname.includes('index.html') && currentUser) {
        // loadDashboardData já foi chamado em checkLoginStatus, mas se o script
        // for carregado *antes* de checkLoginStatus terminar (situação rara com 'defer'),
        // esta chamada garante que ele rode.
        // Neste código atual, a chamada em checkLoginStatus é suficiente.
    }
});