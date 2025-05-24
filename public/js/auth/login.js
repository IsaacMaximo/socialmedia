// Importações
import { initiateLogin, fetchProfile } from './OAuth.js';

// Elementos da UI (exemplo)
const loginBtn = document.getElementById('loginBtn');
const profileSection = document.getElementById('profile');
const userName = document.getElementById('userName');
const userImage = document.getElementById('userImage');

// Evento de Login
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        try {
            await initiateLogin();
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Falha ao iniciar autenticação');
        }
    });
}

// Verificação de estado de login
export async function checkLoginState() {
    try {
        const token = localStorage.getItem('spotify_access_token');
        
        if (token) {
            const profile = await fetchProfile();
            updateUI(profile);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        return false;
    }
}

// Atualiza a UI com os dados do perfil
function updateUI(profile) {
    if (!profile) return;
    
    // Exemplo de atualização da interface
    if (userName) userName.textContent = profile.display_name || 'Usuário';
    if (userImage && profile.images?.[0]?.url) {
        userImage.src = profile.images[0].url;
        userImage.style.display = 'block';
    }
    if (profileSection) profileSection.style.display = 'block';
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    checkLoginState();
});