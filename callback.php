<?php
require_once 'config.php';
require_once 'spotify_api.php';

error_log('SESSION: ' . print_r($_SESSION, true));
error_log('GET: ' . print_r($_GET, true));

$spotify = new SpotifyAPI();

// Verifica erros
if (isset($_GET['error'])) {
    die('Erro: ' . htmlspecialchars($_GET['error']));
}

// Verifica estado (segurança)
// Verifica o estado (CSRF protection)
if (empty($_GET['state']) || $_GET['state'] !== $_SESSION['spotify_auth_state']) {
    die('Erro de segurança: Estado inválido ou não recebido. Sessão: ' . print_r($_SESSION, true));
}

// Obtém token
$tokenData = $spotify->getAccessToken($_GET['code']);

if (isset($tokenData['access_token'])) {
    $_SESSION['spotify_access_token'] = $tokenData['access_token'];
    header('Location: index.php'); // Redireciona de volta
    exit();
} else {
    die('Falha na autenticação');
}
?>