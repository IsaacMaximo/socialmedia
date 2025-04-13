const { builder } = require("@netlify/functions");

exports.handler = builder(async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Netlify Function!" }),
  };
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

// 1. Crie a aplicação Express
const app = express();

// 2. Prepare o cabeçalho de autenticação ANTES de usar
const getAuthHeader = () => {
  return 'Basic ' + Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString('base64');
};

// 3. Configure o CORS corretamente
const corsOptions = {
  origin: [
    'http://localhost',
    'http://localhost:5500',
    'http://127.0.0.1'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 4. Middlewares essenciais
app.use(express.json());

// 5. Rota para autenticação Spotify
app.post('/api/spotify-token', async (req, res) => {
  try {
    console.log("Recebida requisição de token");
    const { code, code_verifier } = req.body;

    if (!code || !code_verifier) {
      return res.status(400).json({ error: "Parâmetros faltando" });
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': getAuthHeader() // Usando a função aqui
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI,
        code_verifier
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Erro do Spotify:", data);
      return res.status(400).json(data);
    }
    
    res.json(data);
    
  } catch (error) {
    console.error("Erro no endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Rota de saúde
app.get('/health', (req, res) => {
  res.send('Servidor operacional');
});

// 7. Inicie o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});