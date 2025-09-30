/*
 * js/script.js
 * Funções utilitárias globais
 */

// NOTA: Este arquivo usa o objeto 'firebase' e as variáveis globais 'db' (firestore) e 'storage'
// definidas no js/firebase-init.js.

/**
 * Retorna as informações do usuário logado salvas no localStorage.
 * Garante que o usuário está logado antes de permitir o acesso.
 * @returns {object|null} Objeto do usuário ou null se não logado.
 */
function getUsuarioLogado() {
    const usuarioLogadoJSON = localStorage.getItem('usuarioLogado');

    if (!usuarioLogadoJSON) {
        // Se não houver informações de login, força o redirecionamento.
        if (window.location.pathname !== '/login.html' && window.location.pathname !== '/cadastrar-usuario.html') {
            window.location.href = 'login.html';
        }
        return null;
    }

    try {
        const userInfo = JSON.parse(usuarioLogadoJSON);
        // Garante que o UID/nome de usuário está presente
        if (!userInfo.nome) {
            localStorage.removeItem('usuarioLogado'); // Limpa se estiver corrompido
            window.location.href = 'login.html';
            return null;
        }
        return userInfo;
    } catch (e) {
        console.error("Erro ao fazer parse das informações do usuário:", e);
        return null;
    }
}

/**
 * Remove o usuário do localStorage e redireciona para a tela de login.
 */
function logout() {
    if (confirm("Tem certeza que deseja sair do sistema?")) {
        // Você pode adicionar aqui firebase.auth().signOut() se estiver usando autenticação
        localStorage.removeItem('usuarioLogado');
        // Redireciona para o login após o logout
        window.location.href = 'login.html';
    }
}

/**
 * Formata um valor numérico para o formato de moeda brasileira (R$).
 * @param {number} valor O valor a ser formatado.
 * @returns {string} O valor formatado como moeda.
 */
function formatarMoeda(valor) {
    // Garante que o valor é um número
    const numericValue = parseFloat(valor) || 0;
    
    return numericValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}


/**
 * Função para alternar a visibilidade de modais no escopo global.
 * @param {string} modalId O ID do elemento modal-overlay.
 * @param {boolean} show Se deve mostrar (true) ou esconder (false).
 */
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    if (show) {
        modal.classList.remove('hidden-start');
        // O display flex é adicionado no style.css
    } else {
        modal.classList.add('hidden-start');
    }
}

/**
 * Wrapper global para abrir o modal de perfil (usado em index.html)
 */
function openProfileModal() {
    toggleModal('profile-modal', true);
}

/**
 * Wrapper global para fechar o modal (usado em index.html)
 */
function closeProfileModal() {
    toggleModal('profile-modal', false);
}


// Adiciona um listener para fechar modais ao clicar fora (no overlay)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            // Se o clique for exatamente no overlay (e não no modal-content dentro dele)
            if (event.target === overlay) {
                // Chama o toggleModal para esconder
                toggleModal(overlay.id, false);
            }
        });
    });
});