/**
 * Inicialização do Firebase e Firestore usando o SDK v8 (via CDN).
 * Garante que a instância 'db' e 'auth' estejam disponíveis globalmente.
 */

// Credenciais do Firebase (Atualizadas com base no seu console)
const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM", 
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR"
};

// 1. Inicializa o Firebase (se ainda não tiver sido inicializado)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Cria a referência global para o Firestore (db)
// Esta variável será usada em todo o seu código para acessar o banco de dados.
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

// 3. Cria a referência global para o Auth (auth)
// Esta variável é necessária para as funções de autenticação.
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;