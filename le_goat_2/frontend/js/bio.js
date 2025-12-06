async function loadBio() {
    const container = document.getElementById("bio");

    try {
        const response = await fetch("/data/bio.json");
        const data = await response.json();

        let html = "";

        data.sections.forEach(sec => {
            html += `<h2>${sec.header}</h2>`;

            if (sec.text) {
                html += `<p>${sec.text}</p>`;
            }

            if (sec.list) {
                html += "<ul>";
                sec.list.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += "</ul>";
            }
        });

        container.innerHTML = html;

    } catch (err) {
        console.error("Error loading bio:", err);
    }
}

loadBio();

