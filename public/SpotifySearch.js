export async function PesquisaSpotify(query, limit = 6) {
    function decodeToken(token) {
        if (!token || token === "undefined" || token === "null") 
            {
            console.error("Token não encontrado ou inválido");
            return null;
            }
        }
  try {
      const token = localStorage.getItem('spotify_access_token');
      decodeToken(token);
      
      if (!token || ['undefined', 'null', 'NaN'].includes(token)) {
          console.error('Token inválido. Redirecionando para login...');
          return null;
      }

        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=from_token`;

      const response = await fetch(url, {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          const error = await response.json();
          console.error('Erro na pesquisa:', error);
          
          if (response.status === 401) {
              localStorage.removeItem('spotify_access_token');
              console.log('Token expirado. Redirecionando...');
          }
          
          return null;
      }

      const data = await response.json();
      
      console.log(`\n=== Resultados para "${query}" ===`);
      console.log(`Total encontrado: ${data.tracks.total}`);
      
      const tracksWithPreview = data.tracks.items.filter(track => track.preview_url);
      console.log(`Músicas com prévia disponível: ${tracksWithPreview.length}/${data.tracks.items.length}`);

      data.tracks.items.forEach((track, index) => {
          console.log(`\n${index + 1}. ${track.name}`);
          console.log(`   ID: ${track.id}`);
          console.log(`   Artista: ${track.artists.map(a => a.name).join(', ')}`);
          console.log(`   Álbum: ${track.album.name}`);
          console.log(`   Duração: ${msToMinutes(track.duration_ms)}`);
          console.log(`   Imagem: ${track.album.images[0]?.url || 'N/A'}`);
          console.log(`   Preview: ${track.preview_url}`);
          console.log(`   URI: ${track.uri}`);
      });

      return data.tracks.items;

  } catch (error) {
      console.error('Erro fatal na pesquisa:', error);
      return null;
  }
}

function msToMinutes(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}