// firebase-init.js

// 1. Configuração
// **Atenção: Use a "Browser key (auto created by Firebase)" do seu console (começa com AIzaSyD5Yv-C...)**
const firebaseConfig = {
    apiKey: "AIzaSyD5Yv-C_wQXdl.0e0BmOTcrzg63Q_DXKy2BM", // Substitua pelo seu Browser key. Eu usei a que apareceu na imagem.
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com",
    messagingSenderId: "10231537149",
    appId: "1:10231537149:web:9f0c2fdb8d44c94d03df4c",
    measurementId: "G-BEB5W8FNXF"
};

// Variáveis globais. Usamos 'let' sem escopo local para que outros scripts possam acessá-las.
let app;
let db; // Firestore
let auth; // FirebaseAuth

// 2. Inicializa o Firebase App
try {
    // Verifica se o SDK foi carregado (necessário no HTML)
    if (typeof firebase !== 'undefined' && typeof firebase.initializeApp === 'function') {
        
        // Se não houver um app, inicializa. Se houver, usa o existente.
        if (!firebase.app.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.app();
        }

        // 3. Define as variáveis globais de serviço.
        // Isso é o que permite que login.js e gerenciar-carteira.html acessem 'db' e 'auth'.
        db = app.firestore();
        auth = app.auth();

        console.log("Firebase e Firestore inicializados com sucesso.");
    } else {
         console.error("ERRO CRÍTICO: Os scripts do SDK do Firebase NÃO foram carregados no seu HTML (firebase-app.js, firebase-firestore.js, etc).");
    }
} catch (e) {
    console.error("ERRO CRÍTICO na inicialização do Firebase:", e.message);
    app = null;
    db = null;
    auth = null;
}