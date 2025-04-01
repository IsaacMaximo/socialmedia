<?php
const clientId = "575da6a8b4444e4187ba5b81924165f3";
const clientSecret = "cc6b3a50391c481a9d8abf03ba0c84b2";
const AUTH_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1";

function getSpotifyToken() {
    $auth_string = base64_encode(CLIENT_ID . ":" . CLIENT_SECRET);
    
    $headers = [
        "Authorization: Basic " . $auth_string,
        "Content-Type: application/x-www-form-urlencoded"
    ];
    
    $data = http_build_query([
        'grant_type' => 'client_credentials'
    ]);
    
    $options = [
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers),
            'content' => $data
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents(AUTH_URL, false, $context);
    
    return json_decode($response, true);
}

function spotifyRequest($endpoint, $token) {
    $url = API_URL . $endpoint;
    
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

try {

    $token_data = getSpotifyToken();
    
    if (isset($token_data['access_token'])) {
        $access_token = $token_data['access_token'];
        
        // Buscar informações (exemplo: top tracks do Ed Sheeran)
        $artist_id = '6eUKZXaKkcviH0Ku9w2n3V'; // ID do Ed Sheeran
        $response = spotifyRequest("/artists/{$artist_id}/top-tracks?market=BR", $access_token);
        
        // Exibir resultados
        echo "<h2>Top músicas do Ed Sheeran:</h2>";
        echo "<ul>";
        foreach ($response['tracks'] as $track) {
            echo "<li>{$track['name']} (Popularidade: {$track['popularity']})</li>";
        }
        echo "</ul>";
    } else {
        echo "Erro ao obter token: " . print_r($token_data, true);
    }
} catch (Exception $e) {
    echo "Erro: " . $e->getMessage();
}
?>