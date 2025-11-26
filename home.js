import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove }
  from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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
const db = getFirestore(app);

let paginaAtual = 0;
const PAGE_SIZE = 15;
let allGames = [];
let currentSearch = '';
let isLoading = false;
let currentUser = null;
let favoritos = [];



onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user; 

    const emailDisplay = document.getElementById("userEmailDisplay");
    if (emailDisplay) {
        if (user.displayName && user.displayName.trim() !== "") {
            emailDisplay.innerText = user.displayName;
        } else {
            emailDisplay.innerText = user.email.split('@')[0];
        }
    }

    await carregarFavoritosDoBanco();
    carregarJogos();

  } else {
    window.location.href = "index.html";
  }
});


// logout
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    signOut(auth).then(() => {
      alert("Você saiu da conta.");
      window.location.href = "index.html";
    }).catch((error) => {
      console.error("Erro ao sair:", error);
    });
  });
}

async function carregarFavoritosDoBanco() {
  if (!currentUser) return;


  const docRef = doc(db, "users", currentUser.uid); 
  const docSnap = await getDoc(docRef);

  if (docSnap.exists() && docSnap.data().favoritos) {
    favoritos = docSnap.data().favoritos;
  } else {
    favoritos = [];
  }
  renderJogos();
}



function toggleDarkMode() {
  document.body.classList.toggle("darkmode");
}

function criarCard(game) {
  const card = document.createElement("div");
  card.className = "card";

  const favBtn = document.createElement("button");
  favBtn.textContent = "❤";
  favBtn.className = "fav-btn";

  if (favoritos.some(f => f.dealID === game.dealID)) {
    favBtn.classList.add("favorited");
  }

  favBtn.addEventListener("click", async () => {
    if (!currentUser) return;

    const index = favoritos.findIndex(f => f.dealID === game.dealID);

    
    const userRef = doc(db, "users", currentUser.uid);

    if (index !== -1) {
      favoritos.splice(index, 1);
      favBtn.classList.remove("favorited");

      await updateDoc(userRef, {
        favoritos: arrayRemove(game)
      });

    } else {
      favoritos.push(game);
      favBtn.classList.add("favorited");

      await setDoc(userRef, {
        favoritos: arrayUnion(game)
      }, { merge: true });
    }
  });

  card.innerHTML = `
    <img src="${game.thumb}" alt="${game.title}">
    <h3>${game.title}</h3>
    <p class="price-old">De: $${game.normalPrice}</p>
    <p class="price-sale">Por: $${game.salePrice}</p>
    <a href="https://www.cheapshark.com/redirect?dealID=${game.dealID}" target="_blank" class="buy-btn">Ir para loja</a>
  `;

  card.appendChild(favBtn);
  return card;
}

async function carregarJogos(pagina = 0, search = '', append = false) {
  if (isLoading) return;
  isLoading = true;

  try {
    let url = `https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15&pageNumber=${pagina}&pageSize=${PAGE_SIZE}`;
    if (search) url += `&title=${encodeURIComponent(search)}`;

    const res = await fetch(url);
    const data = await res.json();

    const novosJogos = data.filter(novo => !allGames.some(jogo => jogo.dealID === novo.dealID));
    allGames = append ? [...allGames, ...novosJogos] : novosJogos;

    renderJogos();

    const loadMoreContainer = document.getElementById("loadMoreContainer");
    loadMoreContainer.innerHTML = "";

    if (data.length === PAGE_SIZE) {
      const btn = document.createElement("button");
      btn.textContent = "Carregar Mais";
      btn.className = "buy-btn";
      btn.addEventListener("click", () => {
        paginaAtual++;
        carregarJogos(paginaAtual, currentSearch, true);
      });
      loadMoreContainer.appendChild(btn);
    } else {
      const fim = document.createElement("p");
      fim.textContent = "🚀 Fim das ofertas disponíveis.";
      fim.style.marginTop = "10px";
      loadMoreContainer.appendChild(fim);
    }
  } catch (e) {
    console.error("Erro ao carregar jogos:", e);
  } finally {
    isLoading = false;
  }
}

function renderJogos() {
  const gameList = document.getElementById("gameList");
  gameList.innerHTML = "";
  allGames.forEach(game => gameList.appendChild(criarCard(game)));
}


document.addEventListener("DOMContentLoaded", () => {

  document.querySelector(".buscar-btn").addEventListener("click", () => {
    currentSearch = document.getElementById("searchInput").value.trim();
    paginaAtual = 0;
    carregarJogos(0, currentSearch, false);
    document.getElementById("ofertasText").innerText = "🎯 Resultados da busca";
  });

  document.querySelector(".voltar-btn").addEventListener("click", () => {
    currentSearch = '';
    paginaAtual = 0;
    document.getElementById("searchInput").value = '';
    document.getElementById("ofertasText").innerText = "🎮 Ofertas em destaque";
    carregarJogos(0, '', false);
  });

  document.querySelector(".darkmode-btn").addEventListener("click", toggleDarkMode);
});

document.querySelector(".favoritos-btn").addEventListener("click", () => {
  const gameList = document.getElementById("gameList");
  gameList.innerHTML = '';

  if (favoritos.length === 0) {
    gameList.innerHTML = '<p>Nenhum favorito salvo.</p>';
  } else {
    favoritos.forEach(game => gameList.appendChild(criarCard(game)));
  }

  document.getElementById("ofertasText").innerText = "❤️ Meus Favoritos";
});
