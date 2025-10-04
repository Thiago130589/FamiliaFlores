/**
 * Arquivo: firebase-init.js
 * Descrição: Configuração e inicialização do Firebase (Versão 8 Namespace)
 * Otimizado para usar SOMENTE o Firestore e Auth.
 * * * * IMPORTANTE: Usando as credenciais do NOVO PROJETO: familia-flores-new
 */

// 1. Configurações (CHAVE E APP ID ATUALIZADOS para o novo projeto)
const firebaseConfig = {
    // Chave de API do novo projeto
    apiKey: "AIzaSyCmoV_45m21CA_LOy7SQR1RsfymtbSZiKc",
    // Credenciais do novo projeto
    authDomain: "familia-flores-new.firebaseapp.com",
    projectId: "familia-flores-new",
    storageBucket: "familia-flores-new.firebasestorage.app",
    messagingSenderId: "367548553329",
    appId: "1:367548553329:web:6a87bd723b9cd36b2ae3d0",
    measurementId: "G-G9JPTHRFQR"
};

// Variáveis globais (Usamos 'let' sem escopo local para que outros scripts possam acessá-las)
let app;
let db;   // Firestore
let auth; // FirebaseAuth

// 2. Inicializa o Firebase App
try {
    // Verificação de segurança: Checa se o SDK (V8) foi carregado
    // É CRÍTICO que os scripts 'firebase-app.js' e 'firebase-firestore.js' estejam no seu HTML
    if (typeof firebase === 'undefined' || typeof firebase.initializeApp !== 'function') {
        console.error("ERRO CRÍTICO: O objeto 'firebase' não está definido. Verifique se os scripts do SDK estão carregados no seu HTML.");
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