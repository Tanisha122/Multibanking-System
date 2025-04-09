document.addEventListener("DOMContentLoaded", () => {
    const readMoreBtn = document.getElementById("read-more-btn");
    const fullContent = document.getElementById("full-content");

    readMoreBtn.addEventListener("click", () => {
        if (fullContent.classList.contains("hidden")) {
            fullContent.classList.remove("hidden");
            readMoreBtn.textContent = "Read Less";
        } else {
            fullContent.classList.add("hidden");
            readMoreBtn.textContent = "Read More";
        }
    });
});
