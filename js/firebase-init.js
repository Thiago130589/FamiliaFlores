/**
 * Inicialização do Firebase (usando o SDK v8 via CDN).
 * Garante que as instâncias 'db' e 'auth' estejam disponíveis globalmente.
 */

// 1. Suas credenciais do Firebase (Use as credenciais reais do seu projeto)
const firebaseConfig = {
    apiKey: "SUA_CHAVE_AQUI", // SUBSTITUIR
    authDomain: "familia-flores-2e6da.firebaseapp.com",
    projectId: "familia-flores-2e6da",
    storageBucket: "familia-flores-2e6da.appspot.com",
    messagingSenderId: "1021517349",
    appId: "1:1021517349:web:0fa6cfa86de5f9da338f494c",
    measurementId: "G-9E95B6VFN8",
};

// 2. Inicializa o Firebase (Se ainda não foi inicializado)
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// 3. Cria e disponibiliza as referências de serviços globalmente
// ESSES OBJETOS 'db' E 'auth' SÃO O QUE FALTAVA
const db = firebase.firestore();
const auth = firebase.auth();
