/**
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (Versão v8 Namespaced)
 */

// Este arquivo depende que as bibliotecas v8 sejam carregadas no HTML.

const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM", // Use sua chave real
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com", 
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR" 
};

// 1. Inicializa o Firebase App usando o objeto global 'firebase'
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Define os serviços
const auth = firebase.auth(); // Adicionado para fins de login
const db = firebase.firestore();

// 3. Inicializa o Storage com a verificação de tipo robusta (mantida)
let storage;
if (typeof firebase.storage !== 'undefined') {
    storage = firebase.storage();
} else {
    console.warn("Firebase Storage não foi inicializado. Verifique se 'firebase-storage.js' está carregado no HTML.");
}