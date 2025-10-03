/**
 * js/index.js
 * Gerenciador da página Dashboard.
 * Depende de script.js (para getUsuarioLogado, logout e formatarMoeda)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tenta obter o usuário logado
    const usuarioLogado = getUsuarioLogado();

    // getUsuarioLogado() cuida do redirecionamento se não estiver logado
    if (!usuarioLogado) {
        return; 
    }

    // 2. Preenche os dados do usuário na tela
    displayUserData(usuarioLogado);
    
    // 3. Gerencia o acesso ao painel de administrador
    handleAdminAccess(usuarioLogado);
});


function displayUserData(user) {
    // Nome
    const nomeElement = document.getElementById('user-name'); 
    if (nomeElement) {
        nomeElement.textContent = user.nome || user.username || 'Usuário';
    }
    
    // Username (Placeholder para email ou apelido)
    const usernameElement = document.getElementById('user-username'); 
    if (usernameElement) {
        // Assume-se que o campo é o 'username' (apelido)
        usernameElement.textContent = `@${user.username || 'anonimo'}`;
    }
    
    // Saldo/Pontuação (Assumindo que o campo é 'pontuacao' ou 0)
    const saldoElement = document.getElementById('user-saldo');
    // Usa a função formatarMoeda do script.js
    if (saldoElement && typeof formatarMoeda === 'function') {
        // Se a pontuação for undefined, usa 0
        saldoElement.textContent = formatarMoeda(user.pontuacao || 0); 
    }
    
    // Perfil (Badge/Etiqueta)
    const perfilBadge = document.getElementById('user-perfil-badge');
    if (perfilBadge) {
        if (user.isAdmin) {
            perfilBadge.textContent = 'ADMIN';
            perfilBadge.classList.add('admin-badge'); 
        } else {
            perfilBadge.textContent = 'USUÁRIO';
            // Remove a classe admin-badge caso tenha sido aplicada (boa prática)
            perfilBadge.classList.remove('admin-badge'); 
        }
    }
    
    // Foto (Se Base64 estiver presente)
    const photoElement = document.getElementById('user-photo');
    if (photoElement && user.foto) {
        photoElement.src = user.foto; // O Base64 será renderizado diretamente
    }
    
    console.log(`Dashboard carregado para: ${user.nome} (Admin: ${user.isAdmin})`);
}


function handleAdminAccess(user) {
    const adminSection = document.getElementById('admin-section'); 

    // A classe 'hidden' é crucial para mostrar/esconder a seção
    if (adminSection) {
        if (user.isAdmin) {
            adminSection.classList.remove('hidden');
        } else {
            adminSection.classList.add('hidden');
        }
    }
}