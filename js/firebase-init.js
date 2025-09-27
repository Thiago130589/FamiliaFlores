// js/firebase-init.js

// 1. CONFIGURAÇÃO do Firebase (Dados do seu projeto)
// ATENÇÃO: Corrigir a apiKey para o valor exato.
var firebaseConfig = {
    apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM", // ESTA É A CORRETA!
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com",
    messagingSenderId: "102151517349",
    appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
    measurementId: "G-8E95B0VFNR"
};

// 2. INICIALIZAÇÃO do Aplicativo Firebase
firebase.initializeApp(firebaseConfig);

// 3. DEFINIÇÃO GLOBAL do Banco de Dados (Firestore)
var db = firebase.firestore();