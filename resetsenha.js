import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_PROJECT_ID.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

const resetForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const messageDisplay = resetForm.querySelector('span');


function handlePasswordReset(event) {
    event.preventDefault(); 
    
    const email = emailInput.value.trim(); 
    
    messageDisplay.innerHTML = "";
    messageDisplay.style.color = "";

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
            
            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-email') {
                messageDisplay.innerHTML = "✅ <strong>E-mail enviado!</strong> Verifique sua caixa de entrada e, se necessário, a pasta de spam.";
                messageDisplay.style.color = "lightgreen";
            } else {
                messageDisplay.innerHTML = `❌ Ocorreu um erro (${errorCode}). Tente novamente mais tarde.`;
                messageDisplay.style.color = "red";
            }
        });
}

resetForm.addEventListener('submit', handlePasswordReset);