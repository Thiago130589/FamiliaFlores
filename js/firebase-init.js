/**
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (usando a sintaxe de Namespace Global do v8)
 */

// NOTA: Este arquivo depende dos SDKs do Firebase v8 (firebase-app.js, firebase-firestore.js, firebase-auth.js)
// serem carregados "antes" no seu HTML.

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
// Acessamos essas variáveis 'db' e 'auth' em todos os outros scripts (login.html, index.html, etc.)
const db = firebase.firestore();

// ----------------------------------------------------------------------------------
// CORREÇÃO: Remova ou comente a linha abaixo, pois o SDK de autenticação não foi carregado.
// Se você está usando login por Firestore (como Thiago), esta linha não é necessária.
// const auth = firebase.auth(); 
// ----------------------------------------------------------------------------------