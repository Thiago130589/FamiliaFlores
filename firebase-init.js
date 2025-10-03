/**
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (Versão v8 Namespaced)
 */

// NOTA: Este arquivo depende que as bibliotecas v8 sejam carregadas no HTML.

const firebaseConfig = {
    apiKey: "...", // Sua chave real
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    // Remova 'storageBucket' se não for usá-lo ou aponte para um balde vazio.
    storageBucket: "familia-flores-2ed6a.appspot.com", 
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..." 
};

// 1. Inicializa o Firebase App usando o objeto global 'firebase'
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Define os serviços que REALMENTE PRECISAMOS
// A 'auth' é usada para o futuro (regras de segurança)
const auth = firebase.auth(); 
const db = firebase.firestore();

// O Storage NÃO é inicializado aqui.
// REMOVA a linha que diz: "let storage; if (typeof firebase.storage !== 'undefined') { storage = firebase.storage(); }"
// E a linha que diz "console.warn("Firebase Storage não foi inicializado...")"