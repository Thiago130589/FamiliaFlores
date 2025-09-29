// Arquivo: js/script.js
// Contém a lógica de carregamento do perfil, menu dinâmico e relógio.

const firestore = window.db; 
const USERS_COLLECTION = 'users';

// ===============================================
// 1. Lógica de Autenticação
// ===============================================

function getLoggedInUsername() {
    const userJson = localStorage.getItem('usuarioLogado');
    if (userJson) {
        try {
            return JSON.parse(userJson).nome; 
        } catch (e) {
            console.error("Erro ao fazer parse do localStorage:", e);
            return null;
        }
    }
    return null;
}

(function checkAuthentication() {
    if (window.location.pathname.endsWith('login.html')) {
        return;
    }
    
    const username = getLoggedInUsername();
    
    if (!username) {
        window.location.href = 'login.html';
        return;
    }
})();


// ===============================================
// 2. Lógica do Relógio de Brasília
// ===============================================

function startBrasiliaClock() {
    const clockElement = document.getElementById('brasiliaClock');
    if (!clockElement) return;

    function updateClock() {
        const options = { 
            timeZone: 'America/Sao_Paulo', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };
        const brasiliaTime = new Date().toLocaleTimeString('pt-BR', options);
        clockElement.textContent = Horário de Brasília: ;
    }

    updateClock();
    setInterval(updateClock, 1000);
}


// ===============================================
// 3. Lógica de Carregamento do Perfil e Menu
// ===============================================

async function loadProfileAndMenu() {
    if (!firestore) {
        console.error("Firestore não inicializado. Verifique firebase-init.js");
        document.getElementById('userName').textContent = 'Erro';
        document.getElementById('userRole').textContent = 'Falha no Firebase';
        return;
    }
    
    const username = getLoggedInUsername();
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const profileImageEl = document.getElementById('profileImage');
    const navMenuEl = document.getElementById('navMenu');
    const loadingLinksEl = document.getElementById('loadingLinks');
    const usernameOverlayEl = document.getElementById('usernameOverlay');

    if (!username) {
        return;
    }
    
    usernameOverlayEl.textContent = Olá, !;

    try {
        const userDoc = await firestore.collection(USERS_COLLECTION).doc(username).get();

        if (!userDoc.exists) {
            userNameEl.textContent = 'Usuário Não Encontrado';
            userRoleEl.textContent = '';
            navMenuEl.innerHTML = '<p class="error-message">Erro: Usuário não existe no banco de dados.</p>';
            return;
        }

        const userData = userDoc.data();
        const role = userData.role || 'Membro'; 
        const displayName = userData.displayName || username; 

        userNameEl.textContent = displayName;
        userRoleEl.textContent = role.toUpperCase(); 
        
        if (userData.photoURL) {
            profileImageEl.src = userData.photoURL;
        } else {
            profileImageEl.src = 'assets/default-profile.png'; 
        }

        buildNavigationMenu(role, navMenuEl, loadingLinksEl);

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        userNameEl.textContent = 'Erro de Conexão';
        userRoleEl.textContent = 'Tente recarregar a página.';
        navMenuEl.innerHTML = '<p class="error-message">Falha ao buscar dados do Firebase.</p>';
    }
}


// ===============================================
// 4. Lógica de Criação do Menu por Cargo
// ===============================================

function buildNavigationMenu(role, navMenuEl, loadingLinksEl) {
    loadingLinksEl.style.display = 'none'; 
    navMenuEl.innerHTML = ''; 

    let links = [];

    // Links comuns a todos
    links.push({ text: 'Minha Carteira', href: 'carteira.html' });
    links.push({ text: 'Minhas Tarefas', href: 'minhas-tarefas.html' });

    if (role === 'Admin') {
        links.push({ text: 'Tarefas Disponíveis', href: 'tarefas-disponiveis.html' });
        links.push({ text: 'Tarefas Pendentes', href: 'tarefas-pendentes.html' });
        links.push({ text: 'Gerenciar Perfis', href: 'gerenciar-perfis.html' });
        links.push({ text: 'Multas (Admin)', href: 'multas.html' });
        links.push({ text: 'Tornar Admin', href: 'tornar-administrador.html' }); 
    } else if (role === 'Membro') {
        links.push({ text: 'Tarefas Disponíveis', href: 'tarefas-disponiveis.html' });
    }
    
    links.push({ text: 'Editar Dados', href: 'editar-dados.html' });


    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        a.classList.add('menu-link');
        navMenuEl.appendChild(a);
    });
}
