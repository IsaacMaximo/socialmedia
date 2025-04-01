const musica = document.getElementById('musica-audio');
const playBtn = document.getElementById('Player-Musica-Botao-Play-btn');
const stopBtn = document.getElementById('Player-Musica-Botao-Anterior-btn');
const IconPlay = document.getElementById('Player-Musica-Botao-Play-btn-img');
const TempoAtual = document.getElementById('ProgressiveBar-Tempo-Atual');
const TempoTotal = document.getElementById('ProgressiveBar-Tempo-Total');
const ProgressiveBar_container = document.getElementById('ProgressiveBar-container');
const ProgressiveBar = document.getElementById('Player-Musica-Botao-ProgressiveBar-div');

function formatarTempo(segundos) {
    if (isNaN(segundos)) return "--:--";
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

function verificarMetadados() {
    if (musica.readyState > 0) {
        console.log('Metadados disponíveis:', musica.duration);
        TempoTotal.innerText = formatarTempo(musica.duration);
    }
}

function atualizarTempoAtual() {
    TempoAtual.textContent = formatarTempo(musica.currentTime);
}

musica.addEventListener('timeupdate', atualizarBarraProgresso);

let ultimoTempoAtual = -1;
function animarTempo() {
    if (Math.abs(musica.currentTime - ultimoTempoAtual) >= 0.5) { // Atualiza a cada ~0.5s
        atualizarTempoAtual();
        ultimoTempoAtual = musica.currentTime;
    }
    requestAnimationFrame(animarTempo);
}
musica.addEventListener('play', () => {
    requestAnimationFrame(animarTempo);
});
atualizarTempoAtual();

musica.addEventListener('loadedmetadata', () => {
    console.log('Evento: Metadata carregado!', musica.duration);
    TempoTotal.innerText = formatarTempo(musica.duration);
});

verificarMetadados();

let tentativas = 0;
const intervalo = setInterval(() => {
    if (musica.readyState > 0 || tentativas > 20) {
        clearInterval(intervalo);
        verificarMetadados();
    }
    tentativas++;
}, 100);


function atualizarIcone() {
    if (musica.paused) {
        console.log("PAUSADO");
        IconPlay.src = 'assets/imgs/Play.svg';
    } else {
        console.log("ON");
        IconPlay.src = 'assets/imgs/Pause.svg';
    }
}

playBtn.addEventListener('click', () => {
    if (musica.paused) {
        musica.play().catch(e => console.log("Erro ao reproduzir:", e));
    } else {
        musica.pause();
        console.log(musica.currentTime);
    }
    atualizarIcone();
});

stopBtn.addEventListener('click', () => {
    musica.pause();
    musica.currentTime = 0;
    atualizarIcone();
});

atualizarIcone();

musica.addEventListener('play', atualizarIcone);
musica.addEventListener('pause', atualizarIcone);



function atualizarBarraProgresso() {
    if (!isDragging) { // Só atualiza automaticamente quando não estiver arrastando
        const progresso = (musica.currentTime / musica.duration) * 100;
        ProgressiveBar.style.width = `${progresso}%`;
    }
}

function handleProgressiveBarClick(e) {
    if (!isNaN(musica.duration)) {
        const Click_Local = e.offsetX;
        const Barra_Tamanho = ProgressiveBar_container.clientWidth;
        const TempoFinal_Click = (Click_Local / Barra_Tamanho) * musica.duration;
        musica.currentTime = TempoFinal_Click;
    }
}

musica.addEventListener('timeupdate', () => {
    atualizarTempoAtual();
    atualizarBarraProgresso();
});

ProgressiveBar_container.addEventListener('click', handleProgressiveBarClick);

let isDragging = false;
let novoTime = 0;

ProgressiveBar_container.addEventListener('mousedown', (e) => {
    isDragging = true;
    
    const rect = ProgressiveBar_container.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    novoTime = percent * musica.duration;
    
    // Atualiza visualmente mas não altera o áudio ainda
    ProgressiveBar.style.width = `${percent * 100}%`;
    ProgressiveBar.style.transition = 'none'; // Remove animação durante arraste
    
    e.preventDefault();
});


document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const rect = ProgressiveBar_container.getBoundingClientRect();
    const percent = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    novoTime = percent * musica.duration;
    
    // Atualiza apenas visualmente
    ProgressiveBar.style.width = `${percent * 100}%`;
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        ProgressiveBar.style.transition = ''; // Restaura animação
        
        // Só atualiza o tempo da música AO SOLTAR
        musica.currentTime = novoTime;
    }
});
const btnVolume = document.getElementById('btn-volume');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

let volumeSalvo = .5;

volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    musica.volume = volume;
    atualizarIconeVolume(volume);
});

btnVolume.addEventListener('click', () => {
    if (musica.volume > 0) {
        volumeSalvo = musica.volume;
        musica.volume = 0;
        volumeSlider.value = 0;
    } else {
        musica.volume = volumeSalvo;
        volumeSlider.value = volumeSalvo;
    }
    atualizarIconeVolume(musica.volume);
});

function atualizarIconeVolume(volume) {
    if (volume == 0) {
        volumeIcon.src = 'assets/imgs/Volume off 1.svg';
    } else if (volume < 0.5) {
        volumeIcon.src = 'assets/imgs/Volume down.svg';
    } else {
        volumeIcon.src = 'assets/imgs/Volume up.svg';
    }
}

musica.volume = .5;
atualizarIconeVolume(1);

function carregarVolume() {
    const volume = localStorage.getItem('volume');
    if (volume) {
        musica.volume = volume;
        volumeSlider.value = volume;
        atualizarIconeVolume(volume);
    }
}

function salvarVolume() {
    localStorage.setItem('volume', musica.volume);
}

window.addEventListener('load', carregarVolume);
volumeSlider.addEventListener('change', salvarVolume);
