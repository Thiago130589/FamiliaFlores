// js/firebase-init.js

// NOTA: Este arquivo depende dos SDKs do Firebase v8 (firebase-app.js, firebase-firestore.js) 
// serem carregados *antes* no seu HTML.

// 1. Sua Configuração do Firebase
// ATENÇÃO: Substitua os valores abaixo pela sua configuração real.
const firebaseConfig = {
    apiKey: "Seu_API_Key_Aqui",
    authDomain: "familia-flores-2ed6a.firebaseapp.com",
    projectId: "familia-flores-2ed6a",
    storageBucket: "familia-flores-2ed6a.appspot.com",
    messagingSenderId: "1062155373487",
    appId: "1:1062155373487:web:9f84bc67f8a84594c9f494",
    measurementId: "G-9C08VPMY7C" 
};

// 2. Inicializa o Firebase App
if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// 3. Define as variáveis globais para acesso fácil
// Acessamos 'db' em todos os scripts para interagir com o Firestore.
const db = firebase.firestore();

// O SERVIÇO DE AUTENTICAÇÃO (Auth) NÃO ESTÁ SENDO USADO PARA O LOGIN (que usa o Firestore).
// Definimos 'auth' como um objeto vazio para compatibilidade e EVITAR o erro 'is not a function' 
// se o SDK do Firebase Auth não for carregado no HTML.
const auth = {};