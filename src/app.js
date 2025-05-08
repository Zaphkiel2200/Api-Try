// --- Estado Global (SST) ---
const SST = {
    animes: [],       // Array para 3 animes
    cargando: false,
    error: null,
  };
  
  // --- Fetch para 3 animes random ---
  async function fetchRandomAnimes() {
    SST.cargando = true;
    SST.error = null;
    SST.animes = []; // Resetear array
  
    try {
      // Hacer 3 llamadas a la API (pueden ser en paralelo con Promise.all)
      for (let i = 0; i < 3; i++) {
        const response = await fetch('https://api.jikan.moe/v4/random/anime');
        if (!response.ok) throw new Error("Error en la API");
        const data = await response.json();
        SST.animes.push(data.data); // Agregar cada anime al array
      }
    } catch (error) {
      SST.error = error.message;
    } finally {
      SST.cargando = false;
      renderAnimes();
    }
  }
  
  // --- Renderizado con Custom Elements ---
  function renderAnimes() {
    const container = document.getElementById('anime-container');
    container.innerHTML = ''; // Limpiar contenedor
  
    if (SST.cargando) {
      container.innerHTML = "<p>Cargando...</p>";
      return;
    }
  
    if (SST.error) {
      container.innerHTML = `<p class="error">${SST.error}</p>`;
      return;
    }
  
    // Crear una tarjeta por cada anime
    SST.animes.forEach(anime => {
      const card = document.createElement('anime-card');
      card.setAttribute('title', anime.title);
      card.setAttribute('image-url', anime.images?.jpg?.image_url || '');
      card.setAttribute('score', anime.score || 'N/A');
      card.setAttribute('url', anime.url || '#');
      container.appendChild(card);
    });
  }
  
  // --- Custom Element: <anime-card> ---
  class AnimeCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      const title = this.getAttribute('title') || 'Sin título';
      const imageUrl = this.getAttribute('image-url');
      const score = this.getAttribute('score');
      const url = this.getAttribute('url');
  
      this.shadowRoot.innerHTML = `
        <style>
          .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px;
            width: 250px;
            text-align: center;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          img { 
            max-width: 100%; 
            height: auto;
            border-radius: 4px;
          }
          h3 { margin: 10px 0; }
          a { 
            color: #4CAF50; 
            text-decoration: none;
          }
        </style>
        <div class="card">
          <img src="${imageUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/150'">
          <h3>${title}</h3>
          <p>⭐ ${score}</p>
          <a href="${url}" target="_blank">Ver más</a>
        </div>
      `;
    }
  }
  
  // Registrar el componente
  customElements.define('anime-card', AnimeCard);
  
  // --- Evento del botón ---
  document.getElementById('cargar-anime').addEventListener('click', fetchRandomAnimes);
  
  // Opcional: Cargar animes al iniciar
  // fetchRandomAnimes();