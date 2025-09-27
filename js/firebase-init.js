// js/firebase-init.js

// 1. CONFIGURAÇÃO do Firebase (Dados do seu projeto)
const firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM",
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR"
};

// 2. INICIALIZAÇÃO do Aplicativo Firebase
firebase.initializeApp(firebaseConfig);

// 3. DEFINIÇÃO GLOBAL da VARIÁVEL do Banco de Dados (Firestore)
// A variável 'db' é criada AQUI.
const db = firebase.firestore();

// ATENÇÃO: Se você usa o Storage para as fotos, adicione a linha abaixo:
// const storage = firebase.storage();