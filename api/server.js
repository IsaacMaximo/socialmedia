require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const getAuthHeader = () => {
  return 'Basic ' + Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString('base64');
};

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
  credentials: true
};
app.get('/api/test', (req, res) => {
  res.json({ message: "API funcionando!" });
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

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

app.get('/health', (req, res) => {
  res.send('Servidor operacional');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
module.exports = app;