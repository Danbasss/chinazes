fetch("data/sample.json")
.then(r => r.json())
.then(data => {
document.getElementById("bio").innerText = data.bio;
});