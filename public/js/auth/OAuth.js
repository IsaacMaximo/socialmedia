// Configurações (substitua com suas credenciais)
const clientId = '575da6a8b4444e4187ba5b81924165f3';
const redirectUri = `${window.location.origin}/callback.html`;

// Gera string aleatória para PKCE
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map(byte => chars[byte % chars.length])
        .join('');
}

// Gera code challenge para PKCE
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

// Inicia fluxo de autenticação
export async function initiateLogin() {
    try {
        const codeVerifier = generateRandomString(128);
        localStorage.setItem('code_verifier', codeVerifier);
        
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        const params = new URLSearchParams({
            client_id: clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            scope: 'user-read-private user-read-email user-read-playback-state',
            code_challenge_method: 'S256',
            code_challenge: codeChallenge
        });

        window.location.href = `https://accounts.spotify.com/authorize?${params}`;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}

// Troca código por token de acesso
export async function exchangeCodeForToken(code) {
    try {
        const codeVerifier = localStorage.getItem('code_verifier');
        
        const response = await fetch('/api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier
            })
        });

        if (!response.ok) {
            throw new Error('Falha ao obter token');
        }

        const { access_token, refresh_token, expires_in } = await response.json();
        
        // Armazena tokens de forma segura
        localStorage.setItem('spotify_access_token', access_token);
        localStorage.setItem('spotify_refresh_token', refresh_token);
        localStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
        
        return access_token;
    } catch (error) {
        console.error('Erro ao trocar código por token:', error);
        throw error;
    }
}

// Busca perfil do usuário
export async function fetchProfile() {
    try {
        const token = await getValidToken();
        
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Falha ao buscar perfil');

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        throw error;
    }
}

// Verifica e renova token se necessário
async function getValidToken() {
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    
    if (!token || Date.now() > expiry) {
        return await refreshToken();
    }
    
    return token;
}

// Renova token usando refresh token
async function refreshToken() {
    try {
        const refreshToken = localStorage.getItem('spotify_refresh_token');
        
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            })
        });

        if (!response.ok) throw new Error('Falha ao renovar token');

        const { access_token, expires_in } = await response.json();
        
        localStorage.setItem('spotify_access_token', access_token);
        localStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
        
        return access_token;
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_token_expiry');
        throw error;
    }
}