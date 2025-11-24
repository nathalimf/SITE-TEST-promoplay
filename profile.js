// =============================
//  IMPORTS DO FIREBASE
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    updateEmail, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// =============================
//  CONFIG DO FIREBASE (PREENCHA)
// =============================
const firebaseConfig = {
  apiKey: "AIzaSyDzeG_ZpM-EspayYL575yQr9qKcp3s9Wbk",
  authDomain: "promoplay-ab631.firebaseapp.com",
  projectId: "promoplay-ab631",
  storageBucket: "promoplay-ab631.firebasestorage.app",
  messagingSenderId: "1017595249150",
  appId: "1:1017595249150:web:157fdb7cc4237436dc00af",
};

// =============================
//  INICIAR FIREBASE
// =============================
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// =============================
//  CAMPOS DO HTML
// =============================
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const profilePreview = document.getElementById("profile-image-preview");
const fileInput = document.getElementById("file-upload");

let newProfileImageFile = null;

// =============================
//  PREVIEW DA IMAGEM NOVA
// =============================
fileInput.addEventListener("change", () => {
    newProfileImageFile = fileInput.files[0];

    if (newProfileImageFile) {
        profilePreview.src = URL.createObjectURL(newProfileImageFile);
    }
});

// =============================
//  CARREGAR DADOS DO USUÁRIO
// =============================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }

    // Dados do Auth
    usernameInput.value = user.displayName || "";
    emailInput.value = user.email || "";

    // Dados extras do Firestore
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        const data = snap.data();
        if (data.photoURL) profilePreview.src = data.photoURL;
    }
});

// =============================
//  SALVAR ALTERAÇÕES DO PERFIL
// =============================
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const newName = usernameInput.value;
    const newEmail = emailInput.value;

    try {
        // 1️⃣ Atualiza nome no Auth
        await updateProfile(user, { displayName: newName });

        // 2️⃣ Atualiza email no Auth
        if (newEmail !== user.email) {
            await updateEmail(user, newEmail);
        }

        let photoURL = user.photoURL;

        // 3️⃣ Salvar nova foto no Storage
        if (newProfileImageFile) {
            const imgRef = ref(storage, `profilePics/${user.uid}.jpg`);
            await uploadBytes(imgRef, newProfileImageFile);
            photoURL = await getDownloadURL(imgRef);

            await updateProfile(user, { photoURL });
        }

        // 4️⃣ Salvar tudo no Firestore
        await setDoc(doc(db, "users", user.uid), {
            displayName: newName,
            email: newEmail,
            photoURL
        }, { merge: true });

        alert("Perfil atualizado com sucesso!");
    } catch (err) {
        console.error(err);
        alert("Erro ao atualizar: " + err.message);
    }
});

