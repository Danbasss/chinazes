// js/shotchart.js
// D3 not strictly required here — але ми підключили d3 lib у HTML для можливого розширення.
// У цьому скрипті використовуємо чистий JS + невеликі хелпери d3-like ( можна замінити повністю на d3 )

// ---------- 1) DATA: 14 zones (LeBron career / league numbers) ----------
const zonesData = {
  "zone-left-corner-3":     { name: "3 Point Corner Right",   player: 36.9, league: 38.8 },
  "zone-left-wing-3":       { name: "3 Pointer Wing Right",   player: 33.8, league: 35.4 }, 
  "zone-center-3":          { name: "3 Pointer Straight",     player: 35.0, league: 34.5 },
  "zone-right-wing-3":      { name: "3 Pointer Wing Left",    player: 35.1, league: 35.3 },
  "zone-right-corner-3":    { name: "3 Point Corner Left",    player: 39.6, league: 38.6 },

  "zone-left-long-mid":     { name: "2P 15+ Feet Right Corner", player: 37.1, league: 40.0 },
  "zone-left-short-mid":    { name: "2P 5-15 Feet Right Corner", player: 33.6, league: 39.6 },

  "zone-center-long-mid":   { name: "2P 15+ Feet Straight",    player: 39.0, league: 40.4 },
  "zone-center-short-mid":  { name: "2P 5-15 Straight",       player: 41.6, league: 42.6 },

  "zone-right-short-mid":   { name: "2P 5-15 Feet Left Corner", player: 39.5, league: 39.4 },
  "zone-right-long-mid":    { name: "2P 15+ Feet Left Wing",  player: 39.6, league: 39.9 },

  "zone-paint-left":        { name: "Paint Left",            player: 0, league: 0 }, // left/right paint not given individually; will use 'Under 5 Feet' for restricted
  "zone-paint-right":       { name: "Paint Right",           player: 0, league: 0 },

  "zone-restricted":        { name: "Under 5 Feet",         player: 67.2, league: 57.0 }
};

// NOTE: some paint zones were aggregated in the description — we set paint-left/right to 0 (no data)
// you can merge restricted/paint or distribute values as you like. For visual purpose we'll paint restricted strongly.

// ---------- 2) compute diffs and scale ----------
const zoneKeys = Object.keys(zonesData);

// compute diffs
let maxPos = 0, maxNeg = 0;
zoneKeys.forEach(k => {
  const z = zonesData[k];
  if (z.player === 0 && z.league === 0) {
    z.diff = 0;
  } else {
    z.diff = +(z.player - z.league); // positive => better than league
    if (z.diff > maxPos) maxPos = z.diff;
    if (z.diff < maxNeg) maxNeg = Math.abs(z.diff);
  }
});

// set minimal positive/negative to avoid division by zero
maxPos = Math.max(maxPos, 0.1);
maxNeg = Math.max(maxNeg, 0.1);

// color mapping function: negative -> blue scale, positive -> orange scale
function zoneColor(diff) {
  // normalize
  if (diff >= 0) {
    const t = Math.min(diff / maxPos, 1); // 0..1
    // use stronger opacity for larger diffs
    const opacity = 0.25 + t * 0.75; // 0.25..1
    // base orange gradient: use HSL for consistency
    // darken as t increases
    const hue = 30; // orange
    const sat = 90; 
    const light = 55 - t * 25; // 55 -> 30
    return `hsla(${hue}, ${sat}%, ${light}%, ${opacity})`;
  } else {
    const t = Math.min(Math.abs(diff) / maxNeg, 1);
    const opacity = 0.25 + t * 0.75;
    const hue = 210; // blue
    const sat = 85;
    const light = 60 - t * 25; // 60 -> 35
    return `hsla(${hue}, ${sat}%, ${light}%, ${opacity})`;
  }
}

// ---------- 3) paint zones initially ----------
zoneKeys.forEach(id => {
  const el = document.getElementById(id);
  const z = zonesData[id];
  if (!el || !z) return;

  // If paint-left/right are zero (no data), set subtle neutral tone
  let fill = z.player === 0 && z.league === 0 ? 'rgba(255,255,255,0.02)' : zoneColor(z.diff);
  el.style.fill = fill;
  el.style.stroke = 'rgba(255,255,255,0.06)';
});

// ---------- 4) tooltip & interaction ----------
const tooltip = document.getElementById('tooltip');

function showTooltip(evt, stats) {
  const diff = (stats.player - stats.league);
  const diffText = diff >= 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
  let note = '';
  if (Math.abs(diff) >= 1.0) {
    note = diff > 0 ? ` (${diff.toFixed(1)}% higher)` : ` (${Math.abs(diff).toFixed(1)}% lower)`;
  }

  tooltip.innerHTML = `
    <div style="font-weight:700; margin-bottom:6px">${stats.name}</div>
    <div>Player: <b>${stats.player}%</b></div>
    <div>League: <b>${stats.league}%</b></div>
    <div style="margin-top:6px; color:#ddd">Diff: <b style="color:#fdb927">${diffText}</b>${note}</div>
  `;

  tooltip.classList.remove('hidden');

  // position: keep tooltip inside window
  const pageX = evt.pageX;
  const pageY = evt.pageY;
  const tw = tooltip.offsetWidth;
  const th = tooltip.offsetHeight;
  const margin = 12;

  let left = pageX;
  if (left + tw + margin > window.innerWidth) left = window.innerWidth - tw - margin;
  let top = pageY - th - 20;
  if (top < 10) top = pageY + 20;

  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

function hideTooltip() {
  tooltip.classList.add('hidden');
}

// bind events
zoneKeys.forEach(id => {
  const el = document.getElementById(id);
  const stats = zonesData[id];
  if (!el || !stats) return;

  el.addEventListener('mousemove', (evt) => {
    el.classList.add('hovered');
    showTooltip(evt, stats);
  });
  el.addEventListener('mouseleave', () => {
    el.classList.remove('hovered');
    hideTooltip();
  });
  // optional click to lock tooltip (could be added)
  el.addEventListener('click', (evt) => {
    // simple pulse animation
    el.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.02)', opacity: 0.98 }, { transform: 'scale(1)', opacity: 1 }], { duration: 260 });
  });
});

// ---------- 5) draw legend ----------
(function renderLegend() {
  const legend = document.getElementById('legend');
  if (!legend) return;

  // create five swatches from blue -> neutral -> orange
  const grades = [-1.0, -0.2, 0, 0.2, 1.0]; // relative positions
  legend.innerHTML = '';
  const leftLabel = document.createElement('div'); leftLabel.textContent = 'fg% vs. league: '; leftLabel.style.marginRight='8px';
  legend.appendChild(leftLabel);

  grades.forEach(g => {
    const sw = document.createElement('span');
    // approximate diff mapping: -1..1 scaled by maxNeg/maxPos
    const sampleDiff = g * Math.max(maxPos, maxNeg);
    sw.className = 'swatch';
    sw.style.background = zoneColor(sampleDiff);
    legend.appendChild(sw);
  });

  const league = document.createElement('div');
  league.style.marginLeft='10px';
  league.textContent = `league avg baseline`;
  legend.appendChild(league);
})();
