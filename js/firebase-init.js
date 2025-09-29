/*
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (usando a sintaxe de Namespace Global da v8)
 *
 * NOTA: Este arquivo depende das SDKs do Firebase v8 (firebase-app.js, firebase-firestore.js, firebase-auth.js)
 * serem carregadas *antes* no seu HTML.
 */

// Se o objeto 'firebase' não estiver definido (o que deve ser feito pelas tags script no HTML),
// este script pode falhar. Assumimos que as tags foram carregadas.

const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM",
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR" // Removido pois 'analytics' não está sendo usado
};

// 1. Inicializa o Firebase App
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Define as variáveis globais para acesso fácil
// Acessaremos essas variáveis 'db' e 'auth' em todos os outros scripts (login.html, index.html, etc.)
const db = firebase.firestore();
const auth = firebase.auth();