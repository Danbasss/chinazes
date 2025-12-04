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

