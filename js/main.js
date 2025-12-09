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
