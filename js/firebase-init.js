/**
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (usando a sintaxe de Namespace Global do v8)
 */

// NOTA: Este arquivo depende dos SDKs do Firebase v8 (firebase-app.js, firebase-firestore.js)
// serem carregados "antes" no seu HTML.
// Não é necessário carregar firebase-auth.js, pois o login é manual via Firestore.

// Se o objeto "firebase" não estiver definido (o que deve ser feito pela tag script no HTML),
// este script pode falhar. Assumimos que as tags foram carregadas.

const firebaseConfig = {
    apiKey: "...", // Sua chave real
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com",
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..." // analytics não está sendo usado
};

// 1. Inicializa o Firebase App
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Define as variáveis globais para acesso fácil
// Acessamos a variável 'db' em todos os outros scripts
const db = firebase.firestore();

// ----------------------------------------------------------------------------------
// LINHA DE ERRO REMOVIDA/COMENTADA: Não precisamos do Auth para login manual no Firestore.
// const auth = firebase.auth(); 
// ----------------------------------------------------------------------------------