/**
 * Arquivo: firebase-init.js
 * Descrição: Inicializa o Firebase e exporta as instâncias de Auth e Firestore.
 * * ATENÇÃO: Verifique a API Key (apiKey) no Google Cloud (Browser key).
 * Key usada nas imagens: "AIzaSyD5Yv-C_wQ...DXKy2BM"
 */

// 1. Configuração do Firebase
const firebaseConfig = {
    // COLOQUE A CHAVE CORRETA AQUI!
    // A chave usada nas suas imagens é: AIzaSyD5Yv-C_wQxDll_Oe0BmOTcrzg63Q_DXKy2BM
    apiKey: "AIzaSyD5Yv-C_wQxDll_Oe0BmOTcrzg63Q_DXKy2BM", 
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com",
    messagingSenderId: "38215537586",
    appId: "1:38215537586:web:1d8d5162a0141f2389d4c",
    measurementId: "G-8ER9R9R6M4"
};

// 2. Inicializa o Firebase App
// Garante que o app seja inicializado apenas uma vez
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 3. Define as variáveis globais de serviço.
// Isso é o que permite que login.js acesse 'db' e 'auth'.
const db = firebase.firestore();
const auth = firebase.auth();

// Torna as variáveis acessíveis globalmente para outros scripts (como login.js)
window.db = db;
window.auth = auth;

console.log("Firebase e Firestore inicializados com sucesso. (global)");
// --- FIM DO ARQUIVO ---