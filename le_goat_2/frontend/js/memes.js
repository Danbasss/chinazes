const grid = document.getElementById("memeGrid");
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");

// Завантажуємо JSON із мемами
fetch("../data/memes.json")
    .then(res => res.json())
    .then(memes => {
        memes.forEach(src => {
            let img = document.createElement("img");
            img.src = src;
            img.addEventListener("click", () => openViewer(src));
            grid.appendChild(img);
        });
    });

// Fullscreen відкриття
function openViewer(src) {
    viewerImg.src = src;
    viewer.classList.remove("hidden");
}

// Закриття по кліку
viewer.addEventListener("click", () => {
    viewer.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("main-nav");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                navMenu.classList.remove("active");
            }
        });
    }
});