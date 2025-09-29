/**
 * Inicialização do Firebase e Firestore usando o SDK v8 (via CDN).
 * Garante que a instância 'db' esteja disponível globalmente.
 */

// Se suas credenciais do Firebase
const firebaseConfig = {
    // Insira suas credenciais do Firebase aqui, baseadas na imagem image_0a90d4.png
    apiKey: "SUA_API_KEY_AQUI", 
    authDomain: "famila-flores-2ed6a.firebaseapp.com",
    projectId: "famila-flores-2ed6a",
    storageBucket: "famila-flores-2ed6a.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID",
    measurementId: "SEU_MEASUREMENT_ID"
};

// Inicializa o Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Cria a referência global para o Firestore (db)
// Use firebase.firestore() apenas APÓS o firebase-app e o firebase-firestore terem carregado.
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

// O Auth (autenticação) é necessário no login
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;