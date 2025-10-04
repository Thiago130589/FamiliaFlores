/**
 * Arquivo: firebase-init.js
 * Descrição: Configuração e inicialização do Firebase (Versão 8 Namespace)
 * Otimizado para usar SOMENTE o Firestore e Auth.
 * * * ATENÇÃO: A Chave de API foi corrigida com base na sua imagem de configuração.
 * Se o erro "API key not valid" persistir, verifique as Restrições de API no Google Cloud Console.
 */

// 1. Configurações
const firebaseConfig = {
  apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM",
  authDomain: "familia-flores-2ed6a.firebaseapp.com",
  projectId: "familia-flores-2ed6a",
  storageBucket: "familia-flores-2ed6a.firebasestorage.app",
  messagingSenderId: "102151517349",
  appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
  measurementId: "G-8E95B0VFNR"
};


// Variáveis globais (Usamos 'let' sem escopo local para que outros scripts possam acessá-las)
let app;
let db;   // Firestore
let auth; // FirebaseAuth

// 2. Inicializa o Firebase App
try {
    // Verificação de segurança: Checa se o SDK foi carregado
    if (typeof firebase === 'undefined' || typeof firebase.initializeApp !== 'function') {
        console.error("ERRO CRÍTICO: O objeto 'firebase' não está definido. Verifique se o 'firebase-app.js' está carregado no seu HTML.");
    }

    // Se não houver um app, inicializa. Se houver, usa o existente.
    if (firebase.apps.length === 0) {
        app = firebase.initializeApp(firebaseConfig);
    } else {
        app = firebase.app();
    }
    
    // 3. Define as variáveis globais de serviço.
    // Isso é o que permite que login.js e gerenciar-carteira.html acessem 'db' e 'auth'.
    // ATENÇÃO: O serviço .firestore() e .auth() SÓ PODE ser chamado APÓS o app ser inicializado.
    db = app.firestore();
    auth = app.auth();
    
    console.log("Firebase e Firestore inicializados com sucesso.");

} catch (e) {
    console.error("ERRO CRÍTICO na inicialização do Firebase:", e.message);
    app = null;
    db = null;
    auth = null;
}