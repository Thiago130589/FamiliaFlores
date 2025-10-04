/**
 * Arquivo: firebase-init.js
 * Descrição: Configuração e inicialização do Firebase (Versão 8 Namespace)
 * Otimizado para usar SOMENTE o Firestore.
 */

// 1. Configurações (Substitua com suas chaves reais!)
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI", // Use sua chave real
    authDomain: "SUA_DOMAIN_AQUI.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID",
    measurementId: "SEU_MEASUREMENT_ID"
};

// Variáveis globais (NÃO use const, let ou var para injetar globalmente)
// Se não usar const/let/var, o escopo se torna global.
let app;
let db; // Firestore
let auth; // FirebaseAuth

// 2. Inicializa o Firebase App
try {
    // Verifica se a variável global 'firebase' do SDK foi carregada
    if (typeof firebase === 'undefined' || typeof firebase.initializeApp !== 'function') {
        console.error("ERRO CRÍTICO: O script 'firebase-app.js' NÃO foi carregado no seu HTML.");
    }

    // Verifica se já existe um app inicializado
    if (firebase.apps.length === 0) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
    
    // 3. Define as variáveis globais de serviço
    // Nota: O acesso global é necessário para que outros scripts como login.js o utilizem.
    db = app.firestore();
    auth = app.auth();
    
    console.log("Firebase e Firestore inicializados com sucesso.");

} catch (e) {
    console.error("ERRO CRÍTICO na inicialização do Firebase:", e.message);
    // Em caso de erro, definimos como null para evitar erros de referência em outros arquivos
    app = null;
    db = null;
    auth = null;
}