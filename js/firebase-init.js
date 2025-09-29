/**
 * Inicialização do Firebase e Firestore.
 * Deve ser importado no <head> de todos os arquivos HTML.
 * NOTA: O SDK v8 é usado nos imports HTML para compatibilidade com o seu código.
 */

// Se estiver usando o SDK v8 (via scripts CDN nos arquivos HTML):
// <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>

const firebaseConfig = {
    // INSIRA SUAS CHAVES DE ACESSO AQUI (Baseado na imagem image_0a90d4.png)
    apiKey: "SUA_API_KEY_AQUI", 
    authDomain: "famila-flores-2ed6a.firebaseapp.com",
    projectId: "famila-flores-2ed6a",
    storageBucket: "famila-flores-2ed6a.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID",
    measurementId: "SEU_MEASUREMENT_ID"
};

// Inicializa o Firebase (apenas se não tiver sido inicializado)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Cria uma referência global para o Firestore (db)
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;