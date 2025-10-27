// повертає у початкове положення при перезавантажені
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

//translation
async function setLanguage(lang, url) {
  if (lang == ''){    
    if (localStorage.getItem("lang") == 'ua'){
      lang = 'en'
    }
    else {
      lang = 'ua'
    }
    localStorage.setItem("lang", lang);
    window.location.href = `${url}?per=${encodeURIComponent(lang)}`;
  }
  else{
    response = await fetch(`lang/${lang}.json`);
    const translations = await response.json();

    // Шукажмо всі елементи з атрибутом data-translate
    document.querySelectorAll("[data-translate]").forEach(el => {
      const key = el.getAttribute("data-translate");
      if (translations[key]) {
        el.innerHTML = translations[key];
      }
    });

    // Sending changes to Flask
    
    // Зберігаємо вибір у localStorage
    localStorage.setItem("lang", lang);
  }
}

// Завантажуємо мову з localStorage при старті сторінки
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "ua";
  setLanguage(savedLang);
});