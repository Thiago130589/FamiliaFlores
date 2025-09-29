// Arquivo: js/firebase-init.js

// Configuração do Firebase (Certifique-se de que é a Versão 8)
const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM",
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR"
};

// Inicializar o Firebase (usa try-catch para evitar erro de inicialização duplicada)
let app;
try {
    app = firebase.initializeApp(firebaseConfig);
} catch (error) {
    if (!/already exists/.test(error.message)) {
        console.error("Erro ao inicializar Firebase:", error);
    }
    app = firebase.app(); // Usa a instância existente
}

// Cria a instância do Firestore e a torna acessível globalmente
const db = firebase.firestore();
window.db = db;
