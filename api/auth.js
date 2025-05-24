import express from 'express';
import axios from 'axios';
import querystring from 'querystring';

const router = express.Router();

// Habilita CORS
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rota para trocar código por token
router.post('/token', async (req, res) => {
  try {
    const { code, code_verifier, redirect_uri } = req.body;

    const response = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        code_verifier
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

    res.json(response.data);
  } catch (error) {
    console.error('Erro no Spotify Token:', error.response?.data || error.message);
    res.status(400).json({ 
      error: 'Failed to authenticate',
      details: error.response?.data || error.message 
    });
  }
});

export default router;