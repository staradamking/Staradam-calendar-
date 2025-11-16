// МЕСЯЦЫ STARADAM
const months = [
  { name: "ЗВЕЗДА", dates: "22 сен – 21 окт 2025" },
  { name: "ЛУНА", dates: "22 окт – 20 ноя 2025" },
  { name: "НЕБО", dates: "21 ноя – 20 дек 2025" },
  { name: "СНЕГ", dates: "21 дек 2025 – 19 янв 2026" },
  { name: "ВОДА", dates: "20 янв – 18 фев 2026" },
  { name: "ВЕТЕР", dates: "19 фев – 20 мар 2026" },
  { name: "СОЛНЦЕ", dates: "21 мар – 19 апр 2026" },
  { name: "ЖИЗНЬ", dates: "20 апр – 19 мая 2026" },
  { name: "ОГОНЬ", dates: "20 мая – 18 июн 2026" },
  { name: "ЗЕМЛЯ", dates: "19 июн – 18 июл 2026" },
  { name: "КОСМОС", dates: "19 июл – 17 авг 2026" },
  { name: "ЭФИР", dates: "18 авг – 16 сен 2026" }
];

// ДИАПАЗОНЫ РЕАЛЬНЫХ ДАТ ДЛЯ ПОДСВЕТКИ "СЕГОДНЯ"
const monthRanges = [
  { start: "2025-09-22", end: "2025-10-21" },
  { start: "2025-10-22", end: "2025-11-20" },
  { start: "2025-11-21", end: "2025-12-20" },
  { start: "2025-12-21", end: "2026-01-19" },
  { start: "2026-01-20", end: "2026-02-18" },
  { start: "2026-02-19", end: "2026-03-20" },
  { start: "2026-03-21", end: "2026-04-19" },
  { start: "2026-04-20", end: "2026-05-19" },
  { start: "2026-05-20", end: "2026-06-18" },
  { start: "2026-06-19", end: "2026-07-18" },
  { start: "2026-07-19", end: "2026-08-17" },
  { start: "2026-08-18", end: "2026-09-16" }
].map(r => ({
  start: new Date(r.start + "T00:00:00"),
  end: new Date(r.end + "T23:59:59")
}));

function getStarAdamToday() {
  const today = new Date();
  today.setHours(0,0,0,0);

  for (let i = 0; i < monthRanges.length; i++) {
    const r = monthRanges[i];
    if (today >= r.start && today <= r.end) {
      const msDay = 24 * 60 * 60 * 1000;
      const dayNumber = Math.floor((today - r.start) / msDay) + 1;
      return { monthIndex: i, dayNumber };
    }
  }
  return null;
}

const starToday = getStarAdamToday();

// ОТРИСОВКА МЕСЯЦА
function createMonthCard(month, index) {
  const card = document.createElement("div");
  card.className = "month-card";

  const header = document.createElement("div");
  header.className = "month-header";

  header.innerHTML = `
    <span>${index + 1}. ${month.name}</span>
    <span class="month-dates">${month.dates}</span>
    <span class="toggle">раскрыть</span>
  `;

  const content = document.createElement("div");
  content.style.display = "none";

  for (let d = 0; d < 3; d++) {
    const label = document.createElement("div");
    label.className = "dec-row-label";
    label.textContent = "Декада " + (d + 1);
    content.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "dec-grid";

    for (let i = 1; i <= 10; i++) {
      const day = i + d * 10;
      const cell = document.createElement("div");
      cell.className = "day-cell";
      cell.textContent = day;

      // ПОДСВЕТКА СЕГОДНЯ
      if (starToday &&
          starToday.monthIndex === index &&
          starToday.dayNumber === day) {
        cell.classList.add("today");
      }

      grid.appendChild(cell);
    }
    content.appendChild(grid);
  }

  header.addEventListener("click", () => {
    const t = header.querySelector(".toggle");
    const hidden = content.style.display === "none";
    content.style.display = hidden ? "block" : "none";
    t.textContent = hidden ? "свернуть" : "раскрыть";
  });

  card.appendChild(header);
  card.appendChild(content);
  return card;
}

// ОТРИСОВКА ВСЕГО КАЛЕНДАРЯ
function renderApp() {
  const app = document.getElementById("app");
  months.forEach((m, i) => app.appendChild(createMonthCard(m, i)));
}

document.addEventListener("DOMContentLoaded", () => {
  renderApp();

  const music = document.getElementById("spaceMusic");
  const playBtn = document.getElementById("playMusic");
  let playing = false;

  playBtn.addEventListener("click", () => {
    if (!playing) {
      music.volume = 0.25;
      music.play();
      playBtn.textContent = "Музыка: Вкл";
    } else {
      music.pause();
      playBtn.textContent = "Музыка";
    }
    playing = !playing;
  });

  document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("light");
  });
});
