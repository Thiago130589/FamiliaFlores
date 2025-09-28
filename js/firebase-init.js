// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM",
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR"
};

// Inicializar o Firebase
// Usa try-catch para evitar erro de "already initialized" se for carregado várias vezes
let app;
try {
    app = firebase.initializeApp(firebaseConfig);
} catch (error) {
    if (!/already exists/.test(error.message)) {
        console.error("Erro ao inicializar Firebase:", error);
    }
    app = firebase.app(); // Usa a instância existente
}


// Exportar serviços (se necessário para módulos, mas para scripts simples, pode ser global)
const db = firebase.firestore();
const analytics = firebase.analytics ? firebase.analytics(app) : null;

// Opcional: Se quiser que db seja global e acessível em outros scripts
window.db = db;
window.firebaseApp = app;
if (analytics) {
    window.firebaseAnalytics = analytics;
}
