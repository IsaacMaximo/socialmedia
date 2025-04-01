<?php
$client_id = "575da6a8b4444e4187ba5b81924165f3";
$client_secret = "cc6b3a50391c481a9d8abf03ba0c84b2";

$url = "https://accounts.spotify.com/api/token";
$data = "grant_type=client_credentials";

$options = [
    "http" => [
        "header" => "Authorization: Basic " . base64_encode("$client_id:$client_secret") . "\r\n" .
                    "Content-Type: application/x-www-form-urlencoded\r\n",
        "method" => "POST",
        "content" => $data,
    ],
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo $result;
?>