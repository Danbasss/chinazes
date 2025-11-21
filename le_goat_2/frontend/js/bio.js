fetch("../data/bio.json")
  .then(response => response.json())
  .then(data => {
      document.getElementById("bio").innerHTML = `
          <h2>${data.full_name}</h2>
          <p>${data.description}</p>
      `;
  })
  .catch(error => console.error("Помилка JSON:", error));
