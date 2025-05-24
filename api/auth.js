import express from 'express';
import axios from 'axios';
import querystring from 'querystring';

const router = express.Router();

// Configurações (use variáveis de ambiente no Vercel)
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '575da6a8b4444e4187ba5b81924165f3';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'sua_client_secret';

// Rota para trocar código por token
router.post('/token', async (req, res) => {
    try {
        const { code, code_verifier, redirect_uri } = req.body;
        
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_CLIENT_SECRET,
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
        console.error('Erro ao obter token:', error.response?.data || error.message);
        res.status(400).json({ error: 'Falha na autenticação' });
    }
});

// Rota para renovar token
router.post('/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.body;
        
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Erro ao renovar token:', error.response?.data || error.message);
        res.status(400).json({ error: 'Falha ao renovar token' });
    }
});

export default router;