export async function PesquisaSpotify(query, limit = 5) {
    try {
      const token = localStorage.getItem('spotify_access_token');
      
      if (!token || token === 'undefined') {
        console.error('Token inválido ou não encontrado. Faça login primeiro.');
        return;
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Erro na pesquisa:', error);
        
        if (response.status === 401) {
          localStorage.removeItem('spotify_access_token');
          console.log('Token expirado. Por favor, faça login novamente.');
        }
        
        return;
      }
  
      const data = await response.json();
      

      console.log(`\n=== Resultados para "${query}" ===`);
      console.log(`Total encontrado: ${data.tracks.total}`);
      
      data.tracks.items.forEach((track, index) => {
        console.log(`\n${index + 1}. ${track.name}`);
        console.log(`   ID: ${track.id}`);
        console.log(`   Artista: ${track.artists.map(a => a.name).join(', ')}`);
        console.log(`   Álbum: ${track.album.name}`);
        console.log(`   Duração: ${msToMinutes(track.duration_ms)}`);
        console.log(`   MUSICA IMG: ${track.album.images[0].url}`);
        console.log(`   Preview: ${track.preview_url || 'Não disponível'}`);
        console.log(`   URI: ${track.uri}`);
      });
  
      return data.tracks.items; // Retorna os resultados para uso posterior
  
    } catch (error) {
      console.error('Erro ao pesquisar músicas:', error);
    }
  }
  
  /**
   * Converte milissegundos para formato mm:ss
   * @param {number} ms - Duração em milissegundos
   */
  function msToMinutes(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  /**
   * Função para testar a pesquisa (opcional)
   */
  export async function testSearch() {
    console.log('Iniciando teste de pesquisa...');
    await searchAndDisplayTracks('The Weeknd', 3);
  }