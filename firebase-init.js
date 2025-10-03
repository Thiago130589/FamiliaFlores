/**
 * js/firebase-init.js
 * Configuração e inicialização do Firebase (Versão v8 Namespaced)
 * Adaptado para usar apenas Auth e Firestore.
 */

// NOTA: Este arquivo depende que as bibliotecas v8 sejam carregadas no HTML.

const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM", // Use sua chave real
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR" 
};

// 1. Inicializa o Firebase App usando o objeto global 'firebase'
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Define os serviços que REALMENTE PRECISAMOS (Auth e Firestore)
// Estas variáveis globais ('auth' e 'db') são usadas em todos os outros scripts.
const auth = firebase.auth(); 
const db = firebase.firestore();

// O Storage não é inicializado aqui.