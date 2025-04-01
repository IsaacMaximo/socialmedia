<?php
require_once 'config.php';

class SpotifyAPI {
    private $clientId;
    private $clientSecret;
    private $redirectUri;
    
    public function __construct() {
        $this->clientId = SPOTIFY_CLIENT_ID;
        $this->clientSecret = SPOTIFY_CLIENT_SECRET;
        $this->redirectUri = SPOTIFY_REDIRECT_URI;
    }
    
    // Gera URL para autenticação
    public function getAuthUrl() {
        $_SESSION['spotify_auth_state'] = SPOTIFY_STATE;
    
    $params = [
        'client_id' => $this->clientId,
        'response_type' => 'code',
        'redirect_uri' => $this->redirectUri,
        'scope' => SPOTIFY_SCOPES,
        'state' => SPOTIFY_STATE, // Garante que o state está sendo enviado
        'show_dialog' => 'false'
    ];
    
    return 'https://accounts.spotify.com/authorize?' . http_build_query($params);
    }
    
    // Obtém token de acesso
    public function getAccessToken($code) {
        $url = 'https://accounts.spotify.com/api/token';
        
        $data = [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->redirectUri,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret
        ];
        
        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data)
            ]
        ];
        
        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);
        
        return json_decode($response, true);
    }
    
    // Faz requisições à API do Spotify (método que você estava tentando implementar)
    public function apiRequest($endpoint, $token) {
        $url = 'https://api.spotify.com/v1' . $endpoint;
        
        $options = [
            'http' => [
                'method' => 'GET',
                'header' => "Authorization: Bearer $token\r\n"
            ]
        ];
        
        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);
        
        return json_decode($response, true);
    }
    
    // Métodos específicos da API (exemplos)
    public function searchTracks($query, $token) {
        $endpoint = '/search?q=' . urlencode($query) . '&type=track&limit=10';
        return $this->apiRequest($endpoint, $token);
    }
    
    public function getUserProfile($token) {
        return $this->apiRequest('/me', $token);
    }
    
    public function getArtistTopTracks($artistId, $token, $market = 'BR') {
        $endpoint = "/artists/$artistId/top-tracks?market=$market";
        return $this->apiRequest($endpoint, $token);
    }
}
?>