<!DOCTYPE html>
<html>
<head>
    <title>Chat da Música</title>
</head>
<body>

    <?php
    $requestUri = $_SERVER['REQUEST_URI'];
    $musicId = basename($requestUri);
    //Pegar os dados completos ccm base no Id

    if ($musicId) {
        echo "<h2>Chat da Música ID: $musicId</h2>";
        echo '<div id="chat-box"></div>';
        echo '<input type="text" id="message-input" placeholder="Digite sua mensagem...">';
        echo '<button onclick="sendMessage(' . $musicId . ')">Enviar</button>';
    } else {
        echo "<p>ID inválido ou não especificado.</p>";
    }
    ?>
</body>
<script type="module" src="SpotifySearchPorID.js"></script>
</html>