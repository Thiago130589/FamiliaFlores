/**
 * Arquivo: firebase-init.js
 * Descrição: Configuração e inicialização do Firebase (Versão 8 Namespace)
 * Otimizado para usar Firestore e Auth.
 * * ATENÇÃO: Se o erro "API key not valid" persistir, substitua a 'apiKey' 
 * pela chave correta do seu console.
 */

// 1. Configurações (Usando a chave que apareceu em uma imagem anterior)
const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM",
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR"
};

// Variáveis globais. Usamos 'let' sem escopo local para que outros scripts possam acessá-las.
let app;
let db;   // Firestore
let auth; // FirebaseAuth

// 2. Inicializa o Firebase App
try {
    // 🚨 Verifica se o SDK foi carregado (necessário no HTML)
    if (typeof firebase === 'undefined' || typeof firebase.initializeApp !== 'function') {
        console.error("ERRO CRÍTICO: Os scripts do SDK do Firebase NÃO foram carregados no seu HTML (firebase-app.js, firebase-firestore.js, etc).");
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