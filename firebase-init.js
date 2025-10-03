// Arquivo: firebase-init.js

/**
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (Versão v8 Namespaced)
 * Otimizado para usar SOMENTE o Firestore.
 */

const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM", // Use sua chave real
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR" 
};

// 1. Inicializa o Firebase App
let app;
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
} else {
    console.error("ERRO CRÍTICO: O objeto 'firebase' não está definido. Verifique se o 'firebase-app.js' está carregado no seu HTML.");
}

// 2. Define a variável global 'db' com o serviço Firestore.
// A inicialização de 'firebase.auth()' foi removida.
let db;
if (typeof app !== 'undefined' && typeof firebase.firestore !== 'undefined') {
    db = firebase.firestore();
} else {
    console.error("ERRO CRÍTICO: O Firestore (db) falhou ao inicializar. O script 'firebase-firestore.js' está carregado?");
}