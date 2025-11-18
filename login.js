import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzeG_ZpM-EspayYL575yQr9qKcp3s9Wbk",
  authDomain: "promoplay-ab631.firebaseapp.com",
  projectId: "promoplay-ab631",
  storageBucket: "promoplay-ab631.appspot.com",
  messagingSenderId: "1017595249150",
  appId: "1:1017595249150:web:157fdb7cc4237436dc00af",
  measurementId: "G-HX6WVJWQ33"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;



  try {
    await signInWithEmailAndPassword(auth, email, senha);
    alert("Login realizado com sucesso!");
    window.location.href = "home.html"; 
  } catch (error) {

    
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        alert("E-mail ou senha incorretos. Tente novamente.");
        break;
        
      case "auth/invalid-email":
        alert("O endereço de e-mail não é válido.");
        break;

      case "auth/too-many-requests":
        alert("Muitas tentativas falhas. Aguarde alguns minutos e tente de novo.");
        break;

      default:
        alert("Ocorreu um erro inesperado: " + error.message);
    }
  }
});