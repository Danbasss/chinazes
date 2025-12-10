const newsData = [
    {
        title: "Обмін Леброна? Агент легенди зробив категоричну заяву",
        url: "https://football24.ua/sport/news/obmin-lebrona-ahent-lehendy-zrobyv-katehorychnu-zayavu-shchodo-mozhlyvosti-vidkhodu-z-leykers-915031",
    },
    {
        title: "Леброн перевершив легенду: друге місце за перемогами",
        url: "https://basket.com.ua/news/newsday/2025/12/08/lebron-dzhejms-perevershyv-legendu-i-pidnyavsya-na-druge-mistse-za-peremogamy-v-istoriyi-nba/",
    },
    {
        title: "Лерброн Джеймс висловився про свого напарника по команді Остіна Рівза і його прогрес як гравця NBA",
        url: "https://www.newsweek.com/sports/nba/lakers-lebron-james-has-strong-words-on-teammate-austin-reaves-11183097",
    }
];

const container = document.getElementById("news-cards");

newsData.forEach(news => {
    const card = document.createElement("div");
    card.className = "news-card";

    card.innerHTML = `
        <a href="${news.url}" target="_blank">${news.title}</a>
    `;

    container.appendChild(card);
});
