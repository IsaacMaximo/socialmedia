export async function exchangeCodeForToken(code) {
  try {
    const codeVerifier = localStorage.getItem('code_verifier');
    const redirectUri = `${window.location.origin}/callback.html`;
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
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

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Falha ao obter token');
    }

    // Armazena os tokens
    localStorage.setItem('spotify_access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}