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
    valor = parseFloat(valor);
    if (isNaN(valor)) {
        valor = 0;
    }
    
    // 2. Retorna o valor formatado como moeda brasileira (método recomendado)
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
}
