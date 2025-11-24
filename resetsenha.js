import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDzeG_ZpM-EspayYL575yQr9qKcp3s9Wbk",
    authDomain: "promoplay-ab631.firebaseapp.com",
    projectId: "promoplay-ab631",
    storageBucket: "promoplay-ab631.appspot.com",
    appId: "1:1017595249150:web:157fdb7cc4237436dc00af", 
    measurementId: "G-HX6WVJWQ33"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

const resetForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const messageDisplay = document.getElementById('messageDisplay');


function handlePasswordReset(event) {
    event.preventDefault(); 
    
    const email = emailInput.value.trim(); 
    

    if (messageDisplay) {
        messageDisplay.innerHTML = "";
        messageDisplay.style.color = "";
    } else {
        console.error('Elemento messageDisplay não encontrado.');
        return;
    }

    if (!email) {
        messageDisplay.innerHTML = "Por favor, digite seu e-mail.";
        messageDisplay.style.color = "yellow";
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            messageDisplay.innerHTML = "✅ <strong>E-mail enviado!</strong> Verifique sua caixa de entrada e, se necessário, a pasta de spam.";
            messageDisplay.style.color = "lightgreen";
            
            emailInput.value = "";
        })
        .catch((error) => {
            const errorCode = error.code;

            // Mantém a segurança: exibe sucesso para "usuário não encontrado" ou "e-mail inválido"
            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
                messageDisplay.innerHTML = "✅ <strong>E-mail enviado!</strong> Verifique sua caixa de entrada e, se necessário, a pasta de spam.";
                messageDisplay.style.color = "lightgreen";
            } else {
                // Exibe outros erros, como problemas de rede ou domínio não autorizado
                messageDisplay.innerHTML = `❌ Ocorreu um erro (${errorCode}). Tente novamente mais tarde.`;
                messageDisplay.style.color = "red";
            }
        });
}

if (resetForm) {
    resetForm.addEventListener('submit', handlePasswordReset);
} else {
    console.error('Elemento loginForm não encontrado. Verifique o HTML.');
}
// ❌ CHAVE EXTRA REMOVIDA
