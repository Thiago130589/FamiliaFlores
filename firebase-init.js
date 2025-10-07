/**
 * firebase-init.js
 * Configuração e inicialização do Firebase V8 (Global) para uso em scripts.js, login.js e outros.
 * CRÍTICO: As variáveis 'auth' e 'db' (Firestore) são globais e dependem desta inicialização.
 */

// 1. Configuração do Projeto Firebase - Substitua as chaves pelos seus dados
const firebaseConfig = {
    // Chave de API corrigida
    apiKey: "AIzaSyCMoV_45M21CA_L0Y7SQR1RsrymtbSZIkc", 
    authDomain: "familia-flores-new.firebaseapp.com",
    projectId: "familia-flores-new",
    storageBucket: "familia-flores-new.appspot.com", 
    messagingSenderId: "367548553329",
    appId: "1:367548553329:web:0abf5703f8e0d36b2d2a3d0",
};

// 2. Inicializa o Firebase (V8 - Sintaxe Global)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 3. Define as variáveis globais para uso em outros scripts
const auth = firebase.auth();
const db = firebase.firestore();