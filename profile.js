
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateEmail, updateProfile} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyDzeG_ZpM-EspayYL575yQr9qKcp3s9Wbk",
  authDomain: "promoplay-ab631.firebaseapp.com",
  projectId: "promoplay-ab631",
  storageBucket: "promoplay-ab631.appspot.com",
  messagingSenderId: "1017595249150",
  appId: "1:1017595249150:web:157fdb7cc4237436dc00af",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();


const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const profilePreview = document.getElementById("profile-image-preview");
const fileInput = document.getElementById("file-upload");

let newProfileImageFile = null;


fileInput.addEventListener("change", () => {
    newProfileImageFile = fileInput.files[0];

    if (newProfileImageFile) {
        profilePreview.src = URL.createObjectURL(newProfileImageFile);
    }
});


onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
        return;
    }


    usernameInput.value = user.displayName || "";
    emailInput.value = user.email || "";


    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        const data = snap.data();
        if (data.photoURL) profilePreview.src = data.photoURL;
    }
});


document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const newName = usernameInput.value;
    const newEmail = emailInput.value;

    try {
   
        await updateProfile(user, { displayName: newName });


        if (newEmail !== user.email) {
            await updateEmail(user, newEmail);
        }

        let photoURL = user.photoURL;


        if (newProfileImageFile) {
            const imgRef = ref(storage, `profilePics/${user.uid}.jpg`);
            await uploadBytes(imgRef, newProfileImageFile);
            photoURL = await getDownloadURL(imgRef);

            await updateProfile(user, { photoURL });
        }


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

