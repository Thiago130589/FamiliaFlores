// Inicialização do Firebase
// Adicione este arquivo ao seu HTML após o firebase-app.js e firebase-firestore.js

// Configuração do Firebase
const firebaseConfig = {
    // Atenção: Use sua chave real aqui. Usei a que você enviou anteriormente.
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM",
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR"
};

// Inicializar o Firebase (usando try-catch para evitar erro de "already initialized")
let app;
try {
    app = firebase.initializeApp(firebaseConfig);
} catch (error) {
    if (!/already exists/.test(error.message)) {
        console.error("Erro ao inicializar Firebase:", error);
    }
    app = firebase.app(); // Usa a instância existente
}

// Criar a instância do Firestore e torná-la global
const db = firebase.firestore();
window.db = db; // Torna db acessível em qualquer script