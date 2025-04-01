<?php
require_once 'config.php';

// Verifica se a sessão está ativa
if (session_status() === PHP_SESSION_NONE) {
    session_start();
    session_regenerate_id(true); // Adicione esta linha
}

// Verifica erros primeiro
if (isset($_GET['error'])) {
    die('Erro no Spotify: ' . htmlspecialchars($_GET['error']));
}

// Verifica se o parâmetro 'state' existe
if (!isset($_GET['state'])) {
    die('Parâmetro state não recebido. A autenticação não foi concluída corretamente.');
}

// Verifica o estado (CSRF protection)
if ($_GET['state'] !== SPOTIFY_STATE) {
    die('Estado inválido. Possível tentativa de CSRF.');
}

// Verifica se o código de autorização foi recebido
if (!isset($_GET['code'])) {
    die('Código de autorização não recebido.');
}

// Agora processamos o token
require_once 'spotify_api.php';
$spotify = new SpotifyAPI();

try {
    $tokenData = $spotify->getAccessToken($_GET['code']);
    
    if (isset($tokenData['access_token'])) {
        // Armazena os tokens na sessão
        $_SESSION['spotify_access_token'] = $tokenData['access_token'];
        
        // Se veio refresh token, armazena também
        if (isset($tokenData['refresh_token'])) {
            $_SESSION['spotify_refresh_token'] = $tokenData['refresh_token'];
        }
        
        // Redireciona de volta para a página principal
        header('Location: index.php');
        exit();
    } else {
        die('Falha ao obter token de acesso. Resposta do Spotify: ' . print_r($tokenData, true));
    }
} catch (Exception $e) {
    die('Erro na comunicação com o Spotify: ' . $e->getMessage());
}
ini_set('session.cookie_secure', '0');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Lax');
?>