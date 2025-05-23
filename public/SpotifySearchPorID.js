// SpotifyGetTrack.js - Funções específicas para buscar tracks por ID

// Função para buscar uma track pelo ID
export async function getTrackByID(trackID) {
    const token = localStorage.getItem('spotify_access_token');
    
    if (!token || token === "undefined" || token === "null") {
        console.error("Token inválido ou não encontrado");
        return null;
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackID}?market=from_token`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('spotify_access_token');
                console.error("Token expirado. Faça login novamente.");
            }
            throw new Error(`Erro na API: ${response.status}`);
        }

        const track = await response.json();
        return track;

    } catch (error) {
        console.error("Erro ao buscar track por ID:", error);
        return null;
    }
}

// Função auxiliar para formatar a duração (opcional)
function msToMinutes(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}