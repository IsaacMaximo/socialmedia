const AntesLogin = document.getElementById("nlogado");
const DepoisLogin = document.getElementById("logado");
const UserName = document.getElementById("Nome_do_Usuario");
const UserID = document.getElementById("Id_do_Usuario");
const ImgUser = document.getElementById("ImgUser")
import { fetchProfile } from './OAuth.js';

async function checkLoginState() {
    
  try {
    const hasToken = localStorage.getItem('spotify_access_token');
    
    if (hasToken) {
      console.log("Usuário está logado");
      DepoisLogin.id = "opa";
      AntesLogin.id = "sumiu";
      
      const Perfil = await fetchProfile();
      
      if (Perfil?.display_name) {
        UserName.textContent = Perfil.display_name;
      } else {
        UserName.textContent = "Usuário";
        console.warn("Nome de usuário não disponível");
      }
      if (Perfil?.id){
        UserID.textContent = Perfil.id
      } else {
        UserName.textContent = "Usuário";
        console.warn("Nome de usuário não disponível");
      }
      if (Perfil?.images?.[0]?.url){
        ImgUser.src = Perfil.images[0].url
      }
    } else {
      console.log("Usuário não está logado");
      DepoisLogin.id = "sumiu";
      AntesLogin.id = "opa";
    }
    
  } catch (error) {
    console.error("Erro ao verificar estado de login:", error);
    DepoisLogin.id = "sumiu";
    AntesLogin.id = "opa";
  }
}

document.addEventListener('DOMContentLoaded', checkLoginState);