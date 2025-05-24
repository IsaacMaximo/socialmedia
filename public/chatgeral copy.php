<!DOCTYPE html>
<html>
<head>
    <title>Chat da Música</title>
    <style>
        #album-cover {
            width: 200px;
            height: 200px;
            object-fit: cover;
        }
    </style>
</head>
<body>
    <div id="music-info">
        <h1 id="music-title"></h1>
        <p id="music-artist"></p>
        <img id="album-cover" src="" alt="Capa do Álbum">
    </div>

<?php
    $musicId = isset($_GET['id']) ? $_GET['id'] : '';
    if (!preg_match('/^[a-zA-Z0-9]{22}$/', $musicId)) {
        $musicId = '';}
?>
<?php
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $parts = explode('/', trim($requestUri, '/'));
    $id = end($parts);
    $musicId = (preg_match('/^[a-zA-Z0-9]+$/', $id)) ? $id : '';

    if ($musicId && is_numeric($musicId)) {
        echo '<div id="chat-box"></div>';
        echo '<input type="text" id="message-input" placeholder="Digite sua mensagem...">';
        echo '<button onclick="sendMessage(\'' . $musicId . '\')">Enviar</button>';
    } else {
        echo "<p>ID inválido ou não especificado.</p>";
    }
?>

    
<script type="module">
    import { buscarMusicaPorID } from './SpotifySearchPorID.js';

    const musicId = "<?php echo addslashes($musicId); ?>";
    console.log("ID da música:", musicId);
    
    document.addEventListener('DOMContentLoaded', async () => {
        const musicTitle = document.getElementById('music-title');
        const musicArtist = document.getElementById('music-artist');
        const albumCover = document.getElementById('album-cover');
        
        if (!musicId) {
            musicTitle.textContent = "ID inválido ou não especificado";
            return;
        }

        try {
            const musica = await buscarMusicaPorID(musicId);
            musicTitle.textContent = musica.nome;
            musicArtist.textContent = musica.artista;
            albumCover.src = musica.capa;
        } catch (error) {
            musicTitle.textContent = "Erro ao carregar música";
            musicArtist.textContent = error.message;
            console.error("Detalhes do erro:", error);
        }
    });
</script>
</body>
</html>