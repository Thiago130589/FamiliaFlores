// Importar os módulos necessários do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDsYy-C_wQXdLOe08mOTczq63Q_DXky2BM",
  authDomain: "familia-flores-2ed6a.firebaseapp.com",
  projectId: "familia-flores-2ed6a",
  storageBucket: "familia-flores-2ed6a.firebasestorage.app",
  messagingSenderId: "102151517349",
  appId: "1:102151517349:web:0fa6cfa865f9da338f494c",
  measurementId: "G-8E95B0VFNR"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);