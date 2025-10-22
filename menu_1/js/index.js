  window.onload = function() {
    window.scrollTo(0, 0);
  };

document.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById("mainHeader");

  // Зміна прозорості при прокручуванні
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});