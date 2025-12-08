const grid = document.getElementById("highlights-grid");
const viewer = document.getElementById("viewer");
const player = document.getElementById("yt-player");

async function loadHighlights() {
    try {
        const response = await fetch("data/highlights.json");
        const videos = await response.json();

        videos.forEach(video => {
            const card = document.createElement("div");
            card.className = "video-card";
            
            const thumbUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;

            card.innerHTML = `
                <div class="thumbnail-wrapper">
                    <img src="${thumbUrl}" alt="${video.title}">
                    <div class="play-icon"></div>
                </div>
                <div class="video-title">${video.title}</div>
            `;

            card.addEventListener("click", () => openViewer(video.videoId));
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading highlights:", error);
        grid.innerHTML = "<p>Не вдалося завантажити відео.</p>";
    }
}

function openViewer(videoId) {
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    viewer.classList.remove("hidden");
}

viewer.addEventListener("click", () => {
    viewer.classList.add("hidden");
    player.src = ""; 
});

loadHighlights();

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