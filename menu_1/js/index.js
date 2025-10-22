window.onload = function() {
  window.scrollTo(0, 0);
};

//search 
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const value = searchInput.value.trim();
  console.log('Результат:', value);
  
  

  timer = setTimeout(() => {
    updateSearchResults(query);
  }, 500); 
});


//header change when scrolling
document.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById("mainHeader");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});