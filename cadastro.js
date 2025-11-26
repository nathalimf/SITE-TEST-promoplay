import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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

document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    alert("Cadastro realizado com sucesso!");
  } catch (error) {
    let mensagem = "Ocorreu um erro ao cadastrar.";

    if (error.code === 'auth/email-already-in-use') {
      mensagem = "O e-mail inserido já está sendo utilizado. Faça o login ou redefina a senha.";
    } else if (error.code === 'auth/weak-password') {
      mensagem = "A senha é muito fraca. Mínimo 6 caracteres.";
    } else if (error.code === 'auth/invalid-email') {
      mensagem = "O e-mail digitado é inválido.";
    } else {
      mensagem = "Erro: " + error.message;
    }

    alert(mensagem);
  }
});
