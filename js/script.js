/*
 * js/script.js
 * Funções utilitárias globais
 */

// NOTA: Este arquivo usa o objeto 'firebase' e as variáveis globais 'db' (firestore) e 'auth' 
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
 * Esta função é importante pois garante que o modal pode ser aberto e fechado
 * a partir de qualquer script embutido ou elemento onclick.
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

// A função closeModal está definida nos arquivos HTML, mas para a padronização, 
// podemos definir um wrapper global aqui.
function closeModal(modalId) {
    toggleModal(modalId, false);
}


// Opcional: Adiciona um listener para fechar modais ao clicar fora (no overlay)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            // Se o clique for exatamente no overlay (e não no modal-content dentro dele)
            if (event.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });
});