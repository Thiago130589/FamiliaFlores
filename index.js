/**
 * js/index.js
 * Gerenciador da página Dashboard.
 * Depende de script.js (para getUsuarioLogado, logout e formatarMoeda)
 */

// Placeholder SVG simples (temporário) para evitar erro 404 se não houver foto Base64
// 'U' de "Usuário"
const DEFAULT_AVATAR_PATH = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#32c74d"/><text x="50" y="65" font-family="Arial, sans-serif" font-size="50" fill="#ffffff" text-anchor="middle">U</text></svg>';

document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = getUsuarioLogado();

    if (!usuarioLogado) {
        return; 
    }

    // ADICIONEI ESTE LOG PARA VOCÊ VERIFICAR NO CONSOLE O VALOR DA FOTO
    console.log("Dados do Usuário Logado (Verifique o campo 'foto'):", usuarioLogado);

    displayUserData(usuarioLogado);
    handleAdminAccess(usuarioLogado);
});


function displayUserData(user) {
    // ... [Códigos para nome, username, saldo, perfil (isAdmin)] ...

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
    
    // 5. Foto (CARREGAMENTO DO BASE64)
    const photoElement = document.getElementById('user-photo');
    if (photoElement) {
        if (user.foto && user.foto.startsWith('data:')) {
            // Se for Base64 válido, usa o Base64
            photoElement.src = user.foto; 
        } else {
            // Se for nulo ou inválido, usa o placeholder SVG
            photoElement.src = DEFAULT_AVATAR_PATH;
        }
        
        // CORREÇÃO DE VISUALIZAÇÃO: Garante que a imagem é exibida, caso o CSS estivesse escondendo
        photoElement.style.display = 'block'; 
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