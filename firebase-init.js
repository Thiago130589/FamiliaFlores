/**
 * Arquivo: firebase-init.js
 * Descrição: Inicializa o Firebase (Sintaxe Versão 8 para compatibilidade).
 * * ATENÇÃO: Verifique a API Key (apiKey) no Google Cloud (Browser key).
 * Chave mais recente: AIzaSyD5Yv-C_wQxDll_Oe0BmOTcrzg63Q_DXKy2BM (Confirmada em image_0c55c2.png)
 */

// 1. Configuração do Firebase
const firebaseConfig = {
    // USE A CHAVE DE API MAIS RECENTE QUE APARECEU NO SEU CONSOLE
    apiKey: "AIzaSyD5Yv-C_wQxDll_Oe0BmOTcrzg63Q_DXKy2BM", 
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com",
    messagingSenderId: "38215537586",
    appId: "1:38215537586:web:1d8d5162a0141f2389d4c",
    measurementId: "G-8ER9R9R6M4"
};

// 2. Inicializa o Firebase App
// Usa a sintaxe v8: Checa se já existe e inicializa, se não.
try {
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
} catch(error) {
    // Se o SDK não foi carregado corretamente no HTML, isso irá falhar.
    console.error("ERRO CRÍTICO: Falha ao inicializar o Firebase. Verifique os scripts no HTML:", error);
}


// 3. Define as variáveis globais de serviço.
// Isso é o que permite que login.js acesse 'db' e 'auth'.
// Deve ser feito FORA do bloco try/catch para garantir que sejam globais.
let db = null;
let auth = null;

if (firebase.apps.length > 0) {
    db = firebase.firestore();
    auth = firebase.auth();
    // Torna as variáveis acessíveis globalmente para outros scripts (como login.js)
    window.db = db;
    window.auth = auth;
    console.log("Firebase e Firestore inicializados com sucesso. (global)");
} else {
     console.error("Firebase não inicializado. Variáveis 'db' e 'auth' nulas.");
}

// --- FIM DO ARQUIVO ---