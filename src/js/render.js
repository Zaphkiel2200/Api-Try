import { SST } from './state.js';

export function renderAnimes(lista = SST.animes) {
  const container = document.getElementById('anime-container');
  container.innerHTML = '';

  if (SST.cargando) {
    container.innerHTML = "<p>Cargando...</p>";
    return;
  }

  if (SST.error) {
    container.innerHTML = `<p class="error">${SST.error}</p>`;
    return;
  }

  lista.forEach(anime => {
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.innerHTML = `
      <img src="${anime.images?.jpg?.image_url || ''}" alt="${anime.title}">
      <h3>${anime.title}</h3>
      <p>⭐ ${anime.score || 'N/A'}</p>
      <button class="fav-btn" data-id="${anime.mal_id}">❤️ Favorito</button>
      <a href="${anime.url}" target="_blank">Más</a>
    `;
    container.appendChild(card);
  });

  // Eventos para botones de favoritos
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const animeId = parseInt(btn.getAttribute('data-id'));
      const anime = lista.find(a => a.mal_id === animeId);
      if (!SST.favoritos.some(fav => fav.mal_id === animeId)) {
        SST.favoritos.push(anime);
        alert(`¡${anime.title} agregado a favoritos!`);
      }
    });
  });
}

// Botón de Favoritos
document.getElementById('favoritos')?.addEventListener('click', () => {
  if (SST.favoritos.length === 0) {
    alert("No hay animes en favoritos.");
  } else {
    renderAnimes(SST.favoritos);
  }
});