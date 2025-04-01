<?php
require_once 'config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'spotify_api.php';
$spotify = new SpotifyAPI();

// Verifica se usuário está autenticado
$loggedIn = isset($_SESSION['spotify_access_token']);

// Processa busca se estiver logado
$results = [];
if ($loggedIn && isset($_GET['q'])) {
    $results = $spotify->searchTracks($_GET['q'], $_SESSION['spotify_access_token']);
}

// URL para login
$authUrl = $spotify->getAuthUrl();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Spotify API</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <?php if (!$loggedIn): ?>
            <a href="<?= $authUrl ?>" class="login-btn">Login com Spotify</a>
        <?php else: ?>
            <!-- Restante do código da interface -->
        <?php endif; ?>
    </div>
</body>
</html>