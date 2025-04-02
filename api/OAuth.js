const clientId = '575da6a8b4444e4187ba5b81924165f3'; // Seu Client ID
const redirectUri = 'http://localhost/socialmedia/public/callback.html'; // Seu Redirect URI

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(byte => chars[byte % chars.length])
        .join('');
}

async function generateCodeChallenge(codeVerifier) {
    const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(codeVerifier)
    );
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

document.getElementById('loginBtn').addEventListener('click', async () => {
    try {
        const codeVerifier = generateRandomString(128);
        localStorage.setItem('code_verifier', codeVerifier);
        
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        const params = new URLSearchParams({
            client_id: clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            scope: 'user-read-private user-read-email',
            code_challenge_method: 'S256',
            code_challenge: codeChallenge
        });

        window.location.href = `https://accounts.spotify.com/authorize?${params}`;
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao iniciar autenticação. Tente novamente.');
    }
});

export async function fetchProfile() {
    try {
      const token = localStorage.getItem('spotify_access_token');
      
      if (!token || token === 'undefined') {
        console.error('Token inválido ou não encontrado');
        return null;
      }
  
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na API:', errorData);
        
        if (response.status === 401) {
          localStorage.removeItem('spotify_access_token');
        }
        
        return null;
      }
  
      const profile = await response.json();
      console.log('Dados brutos da API:', profile);
      return profile;
      
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  }