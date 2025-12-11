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

    // Tooltip
    const tooltip = document.getElementById('tooltip');
    const headers = document.querySelectorAll('.stats-table th');

    headers.forEach(th => {
        th.addEventListener('mouseover', (e) => {
            const desc = th.getAttribute('data-desc');
            if (desc) {
                tooltip.innerHTML = desc;
                tooltip.classList.remove('hidden');
                
                // Встановлення позиції
                tooltip.style.left = (e.pageX + 15) + 'px';
                tooltip.style.top = (e.pageY - 20) + 'px';
            }
        });

        th.addEventListener('mousemove', (e) => {
            // Оновлюємо позицію при русі миші
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY - 20) + 'px';
        });

        th.addEventListener('mouseout', () => {
            tooltip.classList.add('hidden');
        });
    });
});