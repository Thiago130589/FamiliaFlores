// Arquivo: firebase-init.js

/**
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (Versão v8 Namespaced)
 * Otimizado para usar SOMENTE o Firestore, conforme a autenticação manual via Firestore.
 */

// NOTA CRÍTICA: O HTML deve carregar apenas 'firebase-app.js' e 'firebase-firestore.js'.

const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM", // Use sua chave real
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR" 
};

// 1. Inicializa o Firebase App usando o objeto global 'firebase'
let app;
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app(); // Usa a instância existente
    }
} else {
    console.error("ERRO CRÍTICO: O objeto 'firebase' não está definido. Verifique se o 'firebase-app.js' está carregado no seu HTML.");
}

// 2. Define a variável global 'db' com o serviço Firestore.
// O serviço de autenticação (auth) foi removido para evitar o TypeError,
// já que a autenticação está sendo feita manualmente via Firestore.
const db = typeof app !== 'undefined' ? firebase.firestore() : null;

if (db === null) {
    console.error("ERRO CRÍTICO: O Firestore (db) falhou ao inicializar. O script 'firebase-firestore.js' está carregado?");
}

// O Storage não é inicializado aqui.