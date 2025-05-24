<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Verifica se os parâmetros existem
if (!isset($_GET['id']) || !isset($_GET['token'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Parâmetros id e token são obrigatórios']));
}

$trackID = $_GET['id'];
$token = $_GET['token'];

// Validações básicas
if (empty($trackID) || empty($token)) {
    http_response_code(400);
    die(json_encode(['error' => 'Parâmetros não podem ser vazios']));
}

$url = "https://api.spotify.com/v1/tracks/{$trackID}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer {$token}",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FAILONERROR, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    die(json_encode(['error' => 'Erro na requisição: ' . curl_error($ch)]));
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo $response;
    exit;
}

curl_close($ch);

echo $response;
?>