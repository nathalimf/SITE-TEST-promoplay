let paginaAtual = 0;
const PAGE_SIZE = 15;
let allGames = [];
let currentSearch = '';
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let isLoading = false;

// Modo escuro
function toggleDarkMode() {
  document.body.classList.toggle("darkmode");
}

// Criação dos cards
function criarCard(game) {
  const card = document.createElement("div");
  card.className = "card";

  // Botão de favorito 
  const favBtn = document.createElement("button");
  favBtn.textContent = "❤";
  favBtn.className = "fav-btn";

  if (favoritos.some(f => f.dealID === game.dealID)) {
    favBtn.classList.add("favorited");
  }

  favBtn.addEventListener("click", () => {
    const index = favoritos.findIndex(f => f.dealID === game.dealID);
    if (index !== -1) {
      favoritos.splice(index, 1);
      favBtn.classList.remove("favorited");
    } else {
      favoritos.push(game);
      favBtn.classList.add("favorited");
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
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

// Carregar jogos
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
      fim.style.textAlign = "center";
      fim.style.marginTop = "10px";
      loadMoreContainer.appendChild(fim);
    }
  } catch (e) {
    console.error("Erro ao carregar jogos:", e);
  } finally {
    isLoading = false;
  }
}

// Renderizar lista de jogos
function renderJogos() {
  const gameList = document.getElementById("gameList");
  gameList.innerHTML = "";
  allGames.forEach(game => gameList.appendChild(criarCard(game)));
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  carregarJogos();

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

// Mostrar favoritos
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