window.onload = function() {
  window.scrollTo(0, 0);
};

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