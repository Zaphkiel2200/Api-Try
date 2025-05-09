import { fetchRandomAnimes } from './api.js';

document.getElementById('cargar-anime')?.addEventListener('click', fetchRandomAnimes);

// Cargar animes al inicio (opcional)
fetchRandomAnimes();