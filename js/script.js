/**
 * Este arquivo script.js contém funções Javascript auxiliares reutilizáveis.
 */

/**
 * Função auxiliar para formatar um valor numérico para moeda BRL (R$ X.XXX,XX).
 * @param {number} valor
 * @returns {string} Valor formatado
 */
function formatarMoeda(valor) {
    // Garante que o valor seja um número absoluto, formatado como BRL
    return 'R$ ' + (Math.abs(parseFloat(valor) || 0)).toFixed(2).replace('.', ',');
}