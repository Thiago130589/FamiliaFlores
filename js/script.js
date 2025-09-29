/**
 * Funções JavaScript globais e de utilidade.
 * Deve ser carregado APÓS as bibliotecas do Firebase e ANTES dos scripts da página.
 */

/**
 * Função auxiliar para formatar um valor numérico para moeda BRL (R$ X.XXX,XX).
 * @param {number} valor
 * @returns {string} Valor formatado
 */
function formatarMoeda(valor) {
    // 1. Garante que o valor é um número
    const num = parseFloat(valor || 0); // Usa 0 se for null/undefined
    if (isNaN(num)) {
        return "R$ 0,00";
    }
    
    // 2. Retorna o valor formatado como moeda brasileira (método recomendado)
    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
}

/**
 * Obtém o objeto do usuário logado do localStorage e trata o redirecionamento.
 * * CORREÇÃO DE ADMIN: Garante que o status 'isAdmin' seja lido corretamente
 * como um booleano (true ou false), mesmo que tenha sido salvo como a string "true".
 */
function getUsuarioLogado() {
    const storedValue = localStorage.getItem('usuarioLogado');
    if (!storedValue) {
        // Se não houver usuário logado, redireciona para o login
        window.location.href = 'login.html'; 
        return null;
    }
    try {
        const userInfo = JSON.parse(storedValue);

        // ESSA É A CORREÇÃO PRINCIPAL DO ADMIN
        // Verifica se é o booleano true OU a string "true"
        userInfo.isAdmin = userInfo.isAdmin === true || userInfo.isAdmin === 'true'; 

        return userInfo;
    } catch (e) {
        console.error("Erro ao fazer parse do usuário logado:", e);
        window.location.href = 'login.html';
        return null;
    }
}