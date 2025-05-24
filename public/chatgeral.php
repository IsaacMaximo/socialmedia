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
$musicId = isset($_GET['id']) ? trim($_GET['id']) : '';
$musicId = preg_match('/^[a-zA-Z0-9]{22}$/', $musicId) ? $musicId : '';
?>

<script type="module">
    import { buscarMusicaPorID } from './js/SpotifySearchPorID.js';
    const musicId = "<?php echo addslashes($musicId); ?>";
    
if (musicId) {
    document.addEventListener('DOMContentLoaded', async () => {
        const musicTitle = document.getElementById('music-title');
        const musicArtist = document.getElementById('music-artist');
        const albumCover = document.getElementById('album-cover');
        
        console.log("ID válido encontrado:", musicId);
        
        try {
            
            const musica = await buscarMusicaPorID(musicId);
            musicTitle.textContent = musica.nome;
            musicArtist.textContent = musica.artista;
            albumCover.src = musica.capa;
            console.log(musica);
            
            // Mostra elementos quando carregado com sucesso
            musicTitle.style.display = 'block';
            musicArtist.style.display = 'block';
            albumCover.style.display = 'block';
            
        } catch (error) {
            console.error("Detalhes do erro:", error);
            musicTitle.textContent = "Erro ao carregar música";
            musicArtist.textContent = error.message;
            
            // Mostra mensagem de erro
            musicTitle.style.display = 'block';
            musicArtist.style.display = 'block';
            albumCover.style.display = 'none';
        }
    });
} else {
    console.error("ID inválido ou não especificado");
    document.getElementById('music-title').textContent = 
        "Por favor, acesse com um ID válido na URL: chatgeral.php?id=SEU_ID_SPOTIFY";
    
    // Esconde elementos desnecessários
    document.getElementById('music-artist').style.display = 'none';
    document.getElementById('album-cover').style.display = 'none';
}
</script>
</body>
</html>