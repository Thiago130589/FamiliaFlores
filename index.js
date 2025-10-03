/**
 * js/index.js
 * Gerenciador da página Dashboard.
 * Depende de script.js (para getUsuarioLogado e logout)
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
        nomeElement.textContent = user.nome || user.username;
    }
    
    // Saldo/Pontuação (Assumindo que o campo é 'pontuacao' ou 0)
    const saldoElement = document.getElementById('user-saldo');
    // Usa a função formatarMoeda do script.js
    if (saldoElement && typeof formatarMoeda === 'function') {
        saldoElement.textContent = formatarMoeda(user.pontuacao || 0); 
    }
    
    // Perfil (Badge/Etiqueta)
    const perfilBadge = document.getElementById('user-perfil-badge');
    if (perfilBadge) {
        if (user.isAdmin) {
            perfilBadge.textContent = 'ADMIN';
            // Adiciona classe para estilização (ex: fundo vermelho)
            perfilBadge.classList.add('admin-badge'); 
        } else {
            perfilBadge.textContent = 'USUÁRIO';
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

    // O 'hidden' deve ser uma classe CSS que define display: none;
    if (user.isAdmin) {
        if (adminSection) {
            adminSection.classList.remove('hidden');
        }
    } else {
        if (adminSection) {
            adminSection.classList.add('hidden');
        }
    }
}