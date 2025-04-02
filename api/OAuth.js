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

// Event listener para o botão de login
document.getElementById('loginBtn').addEventListener('click', async () => {
    try {
        const codeVerifier = generateRandomString(128);
        localStorage.setItem('code_verifier', codeVerifier);
        
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        const params = new URLSearchParams({
            client_id: clientId, // Usando a constante definida acima
            response_type: 'code',
            redirect_uri: redirectUri, // Usando a constante definida acima
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

// Função para buscar perfil
async function fetchProfile() {
    const token = localStorage.getItem('spotify_access_token');
    
    if (!token) {
        console.error('❌ Nenhum token encontrado. Faça login primeiro.');
        return;
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const profile = await response.json();
        console.log(profile)
        console.log('%c✅ PERFIL DO SPOTIFY', 'color: #1DB954; font-weight: bold;');
        console.log('👤 Nome:', profile.display_name);
        console.log('📧 Email:', profile.email || 'Não disponível');
        console.log('🆔 ID:', profile.id);
        console.log('❤️ Seguidores:', profile.followers?.total || 0);
        
        if (profile.images?.[0]?.url) {
            console.log('🖼️ Imagem:', profile.images[0].url);
            console.log('%c ', `font-size: 100px; background: url(${profile.images[0].url}) no-repeat;`);
        }

        console.log('🔗 Perfil público:', profile.external_urls.spotify);
        
    } catch (error) {
        console.error('%c❌ Erro ao buscar perfil:', 'color: red;', error);
    }
}
export { fetchProfile };