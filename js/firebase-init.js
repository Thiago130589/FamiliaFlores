/**
 * Inicialização do Firebase e Firestore usando o SDK v8 (via CDN).
 * Garante que a instância 'db' e 'auth' estejam disponíveis globalmente.
 * * NOTA: As credenciais devem ser inseridas manualmente.
 */

// Se suas credenciais do Firebase (Baseado na imagem image_0ce1d4.png e image_0a90d4.png)
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI", // Insira sua chave real aqui!
    authDomain: "famila-flores-2ed6a.firebaseapp.com",
    projectId: "famila-flores-2ed6a",
    storageBucket: "famila-flores-2ed6a.appspot.com",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa86de5f9da338f494c",
    measurementId: "G-9E9SBOVFNF"
};

// Inicializa o Firebase (apenas se não tiver sido inicializado)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Cria a referência global para o Firestore (db)
// SÓ DEVE CHAMAR .firestore() DEPOIS QUE O SCRIPT firebase-firestore.js CARREGOU.
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

// Cria a referência global para o Auth (auth)
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;