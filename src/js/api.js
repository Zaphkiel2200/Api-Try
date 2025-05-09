import { SST } from './state.js';
import { renderAnimes } from './render.js';

export async function fetchRandomAnimes() {
  SST.cargando = true;
  SST.error = null;
  SST.animes = [];

  try {
    for (let i = 0; i < 6; i++) {
      const response = await fetch('https://api.jikan.moe/v4/random/anime');
      if (!response.ok) throw new Error("Error en la API");
      const data = await response.json();
      SST.animes.push(data.data);
    }
  } catch (error) {
    SST.error = error.message;
  } finally {
    SST.cargando = false;
    renderAnimes();
  }
}