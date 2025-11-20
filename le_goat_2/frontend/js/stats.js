fetch("/api/stats")
.then(r => r.json())
.then(data => {
document.getElementById("stats").innerText = JSON.stringify(data);
});