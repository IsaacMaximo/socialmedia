require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

// Validação de variáveis de ambiente
const requiredEnvVars = ['CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente ${envVar} não definida`);
  }
}

const app = express();

// Configuração CORS
const allowedOrigins = [
  'http://localhost',
  'http://localhost:5500',
  'http://127.0.0.1',
  'https://socialmedia-three-indol.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Helper para auth header
const getAuthHeader = () => {
  return 'Basic ' + Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString('base64');
};

// Rotas
app.get('/api/test', (req, res) => {
  res.json({ message: "API funcionando!" });
});

app.post('/api/spotify-token', async (req, res, next) => {
  try {
    const { code, code_verifier } = req.body;

    if (!code || !code_verifier) {
      return res.status(400).json({ error: "Parâmetros faltando" });
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': getAuthHeader()
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI,
        code_verifier
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Erro do Spotify:", data);
      return res.status(400).json(data);
    }
    
    res.json(data);
    
  } catch (error) {
    next(error); // Passa para o middleware de erro
  }
});

app.get('/health', (req, res) => {
  res.send('Servidor operacional');
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;