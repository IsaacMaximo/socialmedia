// Backend: api/auth/spotify.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(401).json({ error: 'Falha ao obter perfil' });
  }
});

export default router;

