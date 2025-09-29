/**
 * Inicialização do Firebase (usando o SDK v8 via CDN).
 * Garante que as instâncias 'db' e 'auth' estejam disponíveis globalmente.
 */

// 1. Suas credenciais do Firebase (AGORA COM OS VALORES REAIS)
const firebaseConfig = {
    // API Key real obtida das configurações do projeto
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM", 
    
    // Valores reais do seu projeto
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.firebasestorage.app",
    messagingSenderId: "102151517349",
    // AppId real obtido das configurações do projeto
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    // measurementId real obtido das configurações do projeto
    measurementId: "G-8E95B0VFNR", 
};

// 2. Inicializa o Firebase (Se ainda não foi inicializado)
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// 3. Cria e disponibiliza as referências de serviços globalmente
const db = firebase.firestore();
const auth = firebase.auth();