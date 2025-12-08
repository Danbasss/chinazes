// Дані статистики
const zonesData = {
  "zone-left-corner-3":     { name: "3 Point Corner Right",   player: 36.9, league: 38.8, volume: 150 },
  "zone-left-wing-3":       { name: "3 Pointer Wing Right",   player: 33.8, league: 35.4, volume: 400 }, 
  "zone-center-3":          { name: "3 Pointer Straight",     player: 35.0, league: 34.5, volume: 500 },
  "zone-right-wing-3":      { name: "3 Pointer Wing Left",    player: 35.1, league: 35.3, volume: 420 },
  "zone-right-corner-3":    { name: "3 Point Corner Left",    player: 39.6, league: 38.6, volume: 160 },

  "zone-left-long-mid":     { name: "2P 15+ Feet Right Corner", player: 37.1, league: 40.0, volume: 200 },
  "zone-left-short-mid":    { name: "2P 5-15 Feet Right Corner", player: 33.6, league: 39.6, volume: 250 },

  "zone-center-long-mid":   { name: "2P 15+ Feet Straight",    player: 39.0, league: 40.4, volume: 300 },
  "zone-center-short-mid":  { name: "2P 5-15 Straight",       player: 41.6, league: 42.6, volume: 350 },

  "zone-right-short-mid":   { name: "2P 5-15 Feet Left Corner", player: 39.5, league: 39.4, volume: 240 },
  "zone-right-long-mid":    { name: "2P 15+ Feet Left Wing",  player: 39.6, league: 39.9, volume: 210 },

  "zone-paint-left":        { name: "Paint Left",            player: 62.0, league: 55.0, volume: 800 }, 
  "zone-paint-right":       { name: "Paint Right",           player: 60.5, league: 55.0, volume: 750 },

  "zone-restricted":        { name: "Under 5 Feet",         player: 67.2, league: 57.0, volume: 1500 }
};

// Налаштування
const width = 500;
const height = 470;
const svg = d3.select("#court");
const gridLayer = svg.select("#grid-layer");
const tooltip = d3.select("#tooltip");

const rimX = 250;
const rimY = 40; 

// Геометрія зон
function getZone(x, y) {
    const dx = x - rimX;
    const dy = y - rimY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); 

    if (dist < 40) return "zone-restricted";

    if (x > 170 && x < 330 && y < 190) {
        return x < 250 ? "zone-paint-left" : "zone-paint-right";
    }

    const isCornerY = y < 140; 
    
    if (isCornerY && (x < 30)) return "zone-left-corner-3";
    if (isCornerY && (x > 470)) return "zone-right-corner-3";

    const isThree = dist > 237.5;

    if (isThree) {
        if (angle >= 70 && angle <= 110) return "zone-center-3";
        return x < 250 ? "zone-left-wing-3" : "zone-right-wing-3";
    }

    const isLong = dist > 140; 

    if (angle >= 70 && angle <= 110) {
        return isLong ? "zone-center-long-mid" : "zone-center-short-mid";
    }
    if (x < 250) {
        return isLong ? "zone-left-long-mid" : "zone-left-short-mid";
    } else {
        return isLong ? "zone-right-long-mid" : "zone-right-short-mid";
    }
}

// Генерація сітки
const cellSize = 15;
const gridData = [];

for (let x = 0; x < width; x += cellSize) {
    for (let y = 0; y < height; y += cellSize) {
        const cx = x + cellSize / 2;
        const cy = y + cellSize / 2;
        
        if (y < 40 && Math.abs(x - 250) > 50) continue;

        const zoneKey = getZone(cx, cy);
        gridData.push({ x, y, zoneKey });
    }
}

// Кольорова шкала
const colorScale = d3.scaleLinear()
    .domain([-10, 0, 10]) 
    .range(["#3498db", "#1a202c", "#e74c3c"])
    .clamp(true);

// Малювання
const cells = gridLayer.selectAll("rect")
    .data(gridData)
    .enter().append("rect")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", cellSize + 0.8)
    .attr("height", cellSize + 0.8)
    .attr("class", d => "grid-cell " + d.zoneKey)
    .attr("fill", d => {
        const data = zonesData[d.zoneKey];
        if (!data || data.player === 0) return "rgba(255,255,255,0.02)";
        return colorScale(data.player - data.league);
    });

cells.on("mouseover", function(event, d) {
    const data = zonesData[d.zoneKey];
    if (!data || data.player === 0) return;

    d3.selectAll(".grid-cell").style("opacity", 0.3);
    d3.selectAll("." + d.zoneKey).style("opacity", 1);

    const made = Math.round((data.player / 100) * data.volume);
    
    tooltip.classed("hidden", false)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 20) + "px")
        .html(`
            <div class="stat-row">Player: <span class="val">${data.player}%</span></div>
            <div class="stat-row">League: <span class="val">${data.league}%</span></div>
            <div class="stat-sub">${made} of ${data.volume}</div>
        `);
})
.on("mousemove", function(event) {
    tooltip
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 20) + "px");
})
.on("mouseout", function() {
    d3.selectAll(".grid-cell").style("opacity", 1);
    tooltip.classed("hidden", true);
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