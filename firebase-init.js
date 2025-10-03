/**
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (Versão v8 Namespaced)
 * **ADAPTADO PARA NÃO USAR FIREBASE STORAGE**
 */

// NOTA: Este arquivo depende que as bibliotecas v8 sejam carregadas no HTML.

const firebaseConfig = {
    apiKey: "...", // Sua chave real
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com", // Manter o campo é inofensivo
    messagingSenderId: "...",
    appId: "...",
    measurementId: "..." 
};

// 1. Inicializa o Firebase App usando o objeto global 'firebase'
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Define os serviços que REALMENTE PRECISAMOS (Auth e Firestore)
const auth = firebase.auth(); 
const db = firebase.firestore();

// O Storage não é inicializado para evitar avisos no console.
// A variável 'storage' não existe mais.