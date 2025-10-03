/**
 * js/index.js
 * Gerenciador da página Dashboard.
 * Depende de script.js (para getUsuarioLogado, logout e formatarMoeda)
 */

// Se você não tem um arquivo 'default-avatar.png' na raiz, use um placeholder universal.
const DEFAULT_AVATAR_PATH = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#ccc"/><text x="50" y="60" font-family="Arial" font-size="40" fill="#fff" text-anchor="middle">?</text></svg>';

document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = getUsuarioLogado();

    if (!usuarioLogado) {
        return; 
    }

    displayUserData(usuarioLogado);
    handleAdminAccess(usuarioLogado);
});


function displayUserData(user) {
    // 1. Nome
    const nomeElement = document.getElementById('user-name'); 
    if (nomeElement) {
        nomeElement.textContent = user.nome || user.username || 'Usuário';
    }
    
    // 2. Username
    const usernameElement = document.getElementById('user-username'); 
    if (usernameElement) {
        usernameElement.textContent = `@${user.username || 'anonimo'}`;
    }
    
    // 3. Saldo/Pontuação
    const saldoElement = document.getElementById('user-saldo');
    if (saldoElement && typeof formatarMoeda === 'function') {
        saldoElement.textContent = formatarMoeda(user.pontuacao || 0); 
    }
    
    // 4. Perfil (Badge/Etiqueta)
    const perfilBadge = document.getElementById('user-perfil-badge');
    if (perfilBadge) {
        if (user.isAdmin) {
            perfilBadge.textContent = 'ADMIN';
            perfilBadge.classList.add('admin-badge'); 
        } else {
            perfilBadge.textContent = 'USUÁRIO';
            perfilBadge.classList.remove('admin-badge'); 
        }
    }
    
    // 5. Foto (CORREÇÃO DA FOTO AQUI)
    const photoElement = document.getElementById('user-photo');
    if (photoElement) {
        if (user.foto) {
            // Se houver Base64, usa o Base64
            photoElement.src = user.foto; 
        } else {
            // Se não houver Base64, usa o placeholder (evita 404)
            photoElement.src = DEFAULT_AVATAR_PATH;
        }
    }
}


function handleAdminAccess(user) {
    const adminSection = document.getElementById('admin-section'); 

    if (adminSection) {
        if (user.isAdmin) {
            adminSection.classList.remove('hidden');
        } else {
            adminSection.classList.add('hidden');
        }
    }
}