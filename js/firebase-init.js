/**
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (usando a sintaxe de Namespace Global do v8)
 */

// NOTA: Este arquivo depende dos SDKs do Firebase v8 (firebase-app.js, firebase-firestore.js, firebase-storage.js)
// serem carregados "antes" no seu HTML.
// O 'firebase-storage.js' é CRÍTICO para o upload de fotos.

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "...", // Sua chave real
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com", // ESSENCIAL para o Storage
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..." // analytics não está sendo usado
};

// 1. Inicializa o Firebase App
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Define as variáveis globais para acesso fácil
const db = firebase.firestore();

// 3. Inicializa o Storage APENAS se a biblioteca foi carregada (resolve o TypeError)
let storage;
if (typeof firebase.storage !== 'undefined') {
    storage = firebase.storage();
} else {
    // Se você removeu o firebase-storage.js do HTML, esta linha não será executada,
    // e 'storage' será 'undefined' (o que é aceitável se você não for usá-lo).
    console.warn("Firebase Storage não foi inicializado. Verifique se 'firebase-storage.js' está carregado no HTML.");
}

// A linha 'const auth = firebase.auth();' foi omitida conforme sua estrutura de login manual.