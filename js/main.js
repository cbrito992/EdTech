/**
 * ARQUIVO PRINCIPAL DE JAVASCRIPT - EDTECH
 * Versão: Validação Rigorosa (3 Casos)
 */

/* ==========================================================================
   1. SEGURANÇA (ROUTER GUARD)
   * Impede acesso direto ao certificado pela URL.
   ========================================================================== */
(function securityCheck() {
    if (window.location.href.includes('certificado.html')) {
        const isFinished = localStorage.getItem('edtech_course_finished') === 'true';
        if (!isFinished) {
            alert("Responda as questões para liberar o seu certificado.");
            window.location.href = 'index.html';
        }
    }
})();

/* ==========================================================================
   2. FUNÇÃO DE CERTIFICADO
   ========================================================================== */
function generateCertificate() {
    // Dupla checagem de segurança
    if (localStorage.getItem('edtech_course_finished') !== 'true') return;

    const nameInput = document.getElementById('studentName');
    const cpfInputVal = document.getElementById('studentCPF');

    if (!nameInput || !cpfInputVal) return;

    const nameValue = nameInput.value.trim();
    const cpfValue = cpfInputVal.value.trim();

    if (nameValue === "" || cpfValue.length < 11) {
        alert("Por favor, preencha seu Nome Completo e um CPF válido.");
        return;
    }

    const displayName = document.getElementById('display-name');
    const displayCpf = document.getElementById('display-cpf');
    const displayDate = document.getElementById('display-date');

    if(displayName) displayName.textContent = nameValue.toUpperCase();
    if(displayCpf) displayCpf.textContent = cpfValue;

    const today = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const dateString = today.toLocaleDateString('pt-BR', options);

    if(displayDate) displayDate.textContent = `Data de emissão: ${dateString}`;

    const formSection = document.getElementById('form-section');
    const certBox = document.getElementById('certificate-box');
    const btnPrint = document.getElementById('btn-print');

    if(formSection) formSection.style.display = 'none';
    if(certBox) certBox.style.display = 'block';
    if(btnPrint) btnPrint.style.display = 'inline-block';

    if(certBox) certBox.scrollIntoView({ behavior: 'smooth' });
}

/* ==========================================================================
   3. LÓGICA PRINCIPAL (DOM READY)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {

    // --- A. BARRA DE PROGRESSO ---
    function updateProgressBar() {
        const progressBar = document.getElementById('global-progress-bar');
        const navCert = document.getElementById('nav-cert-item');
        let progress = 0;

        const l1 = localStorage.getItem('edtech_case_1_ok') === 'true';
        const l2 = localStorage.getItem('edtech_case_2_ok') === 'true';
        const finished = localStorage.getItem('edtech_course_finished') === 'true';

        if (l1) progress += 33;
        if (l2) progress += 33;

        if (finished) {
            progress = 100;
            if (navCert) navCert.style.display = 'block';
        } else {
            if (navCert) navCert.style.display = 'none';
        }

        if (progressBar) progressBar.style.width = progress + '%';
    }
    updateProgressBar();


    // --- B. ENGINE DE PERGUNTAS (QUIZ) ---
    const questions = document.querySelectorAll('.question-card');
    const nextBtn = document.getElementById('btn-next-level') || document.getElementById('btn-finish');
    const progressMsg = document.getElementById('progress-msg');

    // Bloqueio inicial forçado
    if (nextBtn) {
        nextBtn.classList.remove('unlocked');
        nextBtn.style.opacity = "0.5";
        nextBtn.style.pointerEvents = "none";
    }

    if (questions.length > 0) {
        const totalQuestions = questions.length;

        questions.forEach(question => {
            const options = question.querySelectorAll('.option-btn');
            const correctIndex = parseInt(question.getAttribute('data-correct'));
            const feedbackBox = question.querySelector('.feedback-msg');

            question.classList.remove('completed'); // Limpa estado visual

            options.forEach(option => {
                option.addEventListener('click', function () {
                    if (question.classList.contains('completed')) return;

                    const selectedIndex = parseInt(this.getAttribute('data-index'));
                    const clickedOption = this;

                    if (selectedIndex === correctIndex) {
                        // Acertou
                        clickedOption.classList.add('correct');
                        clickedOption.classList.remove('incorrect');
                        question.classList.add('completed');

                        if (feedbackBox) {
                            feedbackBox.textContent = "Correto! Agora você vai para a próxima fase!";
                            feedbackBox.style.display = "block";
                            feedbackBox.style.color = "#155724";
                            feedbackBox.style.backgroundColor = "#d4edda";
                        }
                        checkCompletion();

                    } else {
                        // Errou (Feedback Temporário)
                        clickedOption.classList.add('incorrect');
                        if (feedbackBox) {
                            feedbackBox.textContent = "Incorreto...";
                            feedbackBox.style.display = "block";
                            feedbackBox.style.color = "#721c24";
                            feedbackBox.style.backgroundColor = "#f8d7da";
                        }
                        setTimeout(function() {
                            clickedOption.classList.remove('incorrect');
                            if (feedbackBox) feedbackBox.style.display = 'none';
                        }, 800);
                    }
                });
            });
        });

        // VERIFICA SE O CASO ATUAL (QUESTÕES DA PÁGINA) ESTÁ OK
        function checkCompletion() {
            const completedCount = document.querySelectorAll('.question-card.completed').length;

            // Se respondeu todas desta página (Caso X atendido)
            if (completedCount === totalQuestions) {
                if (nextBtn) {
                    // Libera visualmente o botão
                    nextBtn.classList.add('unlocked');
                    nextBtn.style.opacity = "1";
                    nextBtn.style.pointerEvents = "auto";

                    if (nextBtn.id !== 'btn-finish') {
                        progressMsg.textContent = "Nível completado! Clique abaixo para salvar.";
                    } else {
                        nextBtn.textContent = "Concluir Curso e Gerar Certificado";
                        progressMsg.textContent = "Você finalizou! Clique para validar.";
                    }

                    // --- AQUI ESTÁ A LÓGICA DOS 3 CASOS ---
                    nextBtn.onclick = function(e) {

                        // CASO 1: Questões do Index (Básico)
                        if (window.location.href.includes('index.html') || document.title.includes('Básico')) {
                            localStorage.setItem('edtech_case_1_ok', 'true');
                            // Redireciona para o próximo nível (manual ou link)
                            // O href do botão no HTML cuidará do redirecionamento após salvar
                        }

                        // CASO 2: Questões do Intermediário
                        else if (window.location.href.includes('intermediario.html') || document.title.includes('Intermediário')) {
                            localStorage.setItem('edtech_case_2_ok', 'true');
                        }

                        // TENTATIVA DE GERAR CERTIFICADO (No Avançado)
                        else if (nextBtn.id === 'btn-finish') {
                            e.preventDefault(); // Para o clique para validar

                            // Verifica CASO 1 e CASO 2 na memória
                            const case1 = localStorage.getItem('edtech_case_1_ok') === 'true';
                            const case2 = localStorage.getItem('edtech_case_2_ok') === 'true';
                            // O CASO 3 é verdadeiro porque o botão desbloqueou (completedCount === totalQuestions)

                            if (case1 && case2) {
                                // SUCESSO: Todos os casos atendidos
                                localStorage.setItem('edtech_course_finished', 'true');
                                window.location.href = 'certificado.html';
                            } else {
                                // FALHA: Algum caso anterior não foi atendido
                                alert("Responda as questões para liberar o seu certificado.");
                                // Opcional: Redirecionar para o básico se quiser ser rigoroso
                                // window.location.href = 'index.html';
                            }
                            return;
                        }

                        updateProgressBar();
                    };
                }
            }
        }
    }

    // --- C. CARROSSEL DE IMAGENS ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.btn-right');
        const prevButton = document.querySelector('.btn-left');
        const dotsNav = document.querySelector('.carousel-nav');
        if(slides.length > 0) {
            let slideWidth = slides[0].getBoundingClientRect().width || track.offsetWidth;
            const setSlidePosition = (slide, index) => { slide.style.left = slideWidth * index + 'px'; };
            slides.forEach(setSlidePosition);
            const moveToSlide = (track, currentSlide, targetSlide) => {
                track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
                currentSlide.classList.remove('current-slide');
                targetSlide.classList.add('current-slide');
            };
            const updateDots = (currentDot, targetDot) => {
                currentDot.classList.remove('current-slide');
                targetDot.classList.add('current-slide');
            };
            const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
                if (targetIndex === 0) {
                    if(prevButton) prevButton.style.display = 'none';
                    if(nextButton) nextButton.style.display = 'flex';
                } else if (targetIndex === slides.length - 1) {
                    if(prevButton) prevButton.style.display = 'flex';
                    if(nextButton) nextButton.style.display = 'none';
                } else {
                    if(prevButton) prevButton.style.display = 'flex';
                    if(nextButton) nextButton.style.display = 'flex';
                }
            };
            hideShowArrows(slides, prevButton, nextButton, 0);

            if(prevButton) prevButton.addEventListener('click', () => {
                const currentSlide = track.querySelector('.current-slide');
                const prevSlide = currentSlide.previousElementSibling;
                const currentDot = dotsNav.querySelector('.current-slide');
                const prevDot = currentDot.previousElementSibling;
                const prevIndex = slides.findIndex(slide => slide === prevSlide);
                if(prevSlide) { moveToSlide(track, currentSlide, prevSlide); updateDots(currentDot, prevDot); hideShowArrows(slides, prevButton, nextButton, prevIndex); }
            });

            if(nextButton) nextButton.addEventListener('click', () => {
                const currentSlide = track.querySelector('.current-slide');
                const nextSlide = currentSlide.nextElementSibling;
                const currentDot = dotsNav.querySelector('.current-slide');
                const nextDot = currentDot.nextElementSibling;
                const nextIndex = slides.findIndex(slide => slide === nextSlide);
                if(nextSlide) { moveToSlide(track, currentSlide, nextSlide); updateDots(currentDot, nextDot); hideShowArrows(slides, prevButton, nextButton, nextIndex); }
            });

            if(dotsNav) dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button');
                if (!targetDot) return;
                const currentSlide = track.querySelector('.current-slide');
                const currentDot = dotsNav.querySelector('.current-slide');
                const dots = Array.from(dotsNav.children);
                const targetIndex = dots.findIndex(dot => dot === targetDot);
                const targetSlide = slides[targetIndex];
                moveToSlide(track, currentSlide, targetSlide);
                updateDots(currentDot, targetDot);
                hideShowArrows(slides, prevButton, nextButton, targetIndex);
            });
            window.addEventListener('resize', () => {
                slideWidth = slides[0].getBoundingClientRect().width;
                slides.forEach((slide, index) => { slide.style.left = slideWidth * index + 'px'; });
                const currentSlide = track.querySelector('.current-slide');
                if(currentSlide) {
                    track.style.transition = 'none';
                    track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
                    setTimeout(() => { track.style.transition = 'transform 0.4s ease-in-out'; }, 50);
                }
            });
        }
    }

    // --- D. MÁSCARA CPF ---
    const cpfInput = document.getElementById('studentCPF');
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 9) value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
            else if (value.length > 6) value = value.replace(/^(\d{3})(\d{3})(\d{3}).*/, "$1.$2.$3");
            else if (value.length > 3) value = value.replace(/^(\d{3})(\d{3}).*/, "$1.$2");
            e.target.value = value;
        });
    }

});
