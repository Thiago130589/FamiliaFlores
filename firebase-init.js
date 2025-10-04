/**
 * Arquivo: firebase-init.js
 * Descrição: Configuração e inicialização centralizada do Firebase (v8 Namespace).
 */

// Se estas constantes já estão em outro arquivo (ex: firebase.json), 
// remova-as e importe. Caso contrário, mantenha aqui.
const firebaseConfig = {
    apiKey: "...", // SUA CHAVE REAL
    authDomain: "...", // SEU DOMÍNIO REAL
    projectId: "...", // SEU ID DE PROJETO REAL
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "...",
    // measurementId: "..." // (Opcional, se usar Analytics)
};

// 1. Inicializa o Firebase App
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Define as variáveis globais 'db' e 'auth' (para uso em outros scripts)
const db = firebase.firestore(); 
const auth = firebase.auth(); 

// Variável auxiliar que usa db. O resto do seu código pode referenciar 'db' ou 'firestore'
// como feito antes.
const firestore = db; 

console.log("Firebase e Firestore inicializados com sucesso.");