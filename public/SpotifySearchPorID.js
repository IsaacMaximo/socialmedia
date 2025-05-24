export async function buscarMusicaPorID(id) {
    try {
        // Verificação do token
        const token = localStorage.getItem('spotify_access_token');
        if (!token || ['undefined', 'null', 'NaN'].includes(token)) {
            throw new Error('Token do Spotify não encontrado');
        }

        // Requisição à API do Spotify
        const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            nome: data.name,
            artista: data.artists.map(a => a.name).join(', '),
            capa: data.album.images[0]?.url || 'https://via.placeholder.com/200'
        };

    } catch (error) {
        console.error("Erro na busca:", error);
        throw error;
    }
}