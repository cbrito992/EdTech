document.addEventListener("DOMContentLoaded", () => {
    const btnSimulate = document.querySelector("#btn-simulate-win");
    const rewardSection = document.querySelector("#reward");

    if (btnSimulate && rewardSection) {
        btnSimulate.addEventListener("click", () => {
            rewardSection.classList.remove("hidden");
            rewardSection.scrollIntoView({ behavior: "smooth", block: "start" });

            btnSimulate.disabled = true;
            btnSimulate.textContent = "Desafio concluído! 🎉";
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    /* =========================
       CONFIGURAÇÃO DO ÁUDIO
       ========================= */
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');

    // Verifica se os elementos existem para evitar erros
    if (!audio || !btn) return;

    const iconPlay = btn.querySelector('.icon-play');
    const iconMute = btn.querySelector('.icon-mute');

    // Volume suave para ambiente Noir
    audio.volume = 0.4;
    let isPlaying = false;

    // Atualiza o visual do botão
    function updateIcons() {
        if (isPlaying) {
            iconPlay.classList.remove('hidden');
            iconMute.classList.add('hidden');
            btn.classList.add('playing-pulse');
        } else {
            iconPlay.classList.add('hidden');
            iconMute.classList.remove('hidden');
            btn.classList.remove('playing-pulse');
        }
    }

    // Tenta tocar o áudio
    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            updateIcons();
        }).catch(error => {
            console.log("Autoplay bloqueado. Aguardando interação do usuário.");
            isPlaying = false;
            updateIcons();
        });
    }

    // Pausa o áudio
    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        updateIcons();
    }

    /* =========================
       EVENTOS
       ========================= */

    // 1. Tenta tocar assim que carregar
    playAudio();

    // 2. Fallback: Se bloqueado, toca no primeiro clique na página
    document.body.addEventListener('click', function startOnFirstClick() {
        if (!isPlaying) {
            playAudio();
        }
        // Remove o evento para não disparar novamente
        document.body.removeEventListener('click', startOnFirstClick);
    }, { once: true });

    // 3. Controle manual pelo botão
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita conflito com o clique do body
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });
});