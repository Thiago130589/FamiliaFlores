/**
 * Arquivo: firebase-init.js
 * Descrição: Configuração e inicialização do Firebase (Versão 8 Namespace)
 * Otimizado para usar SOMENTE o Firestore e Auth.
 * * * * IMPORTANTE: Chave de API atualizada com sucesso.
 */

// 1. Configurações (CHAVE E APP ID ATUALIZADOS)
const firebaseConfig = {
    apiKey: "AIzaSyDuliFO2bNSWfplEzcZuY7fRz1PK5muUNQ",
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:8c87e65a3b6e1a568f494c",
    measurementId: "G-V3D7JWZDSN"
};

// Variáveis globais (Usamos 'let' sem escopo local para que outros scripts possam acessá-las)
let app;
let db;   // Firestore
let auth; // FirebaseAuth

// 2. Inicializa o Firebase App
try {
    // Verificação de segurança: Checa se o SDK (V8) foi carregado
    if (typeof firebase === 'undefined' || typeof firebase.initializeApp !== 'function') {
        console.error("ERRO CRÍTICO: O objeto 'firebase' não está definido. Verifique se os scripts do SDK (firebase-app.js, firebase-firestore.js, etc.) estão carregados no seu HTML.");
    }

    // Se não houver um app, inicializa. Se houver, usa o existente.
    if (firebase.apps.length === 0) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
    
    // 3. Define as variáveis globais de serviço.
    // Isso é o que permite que login.js e gerenciar-carteira.html acessem 'db' e 'auth'.
    db = app.firestore();
    auth = app.auth();
    
    console.log("Firebase e Firestore inicializados com sucesso.");

} catch (e) {
    console.error("ERRO CRÍTICO na inicialização do Firebase:", e.message);
    app = null;
    db = null;
    auth = null;
}