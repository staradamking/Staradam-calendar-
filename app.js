// МЕСЯЦЫ STAR ADAM NEW AGE
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

// 10-дневная цветовая неделя
const colorCycle = [
  { name: "Чёрный", code: "#000000" },
  { name: "Коричневый", code: "#7b3f00" },
  { name: "Красный", code: "#ff0000" },
  { name: "Оранжевый", code: "#ff7f00" },
  { name: "Жёлтый", code: "#ffff00" },
  { name: "Зелёный", code: "#00ff00" },
  { name: "Голубой", code: "#33ccff" },
  { name: "Синий", code: "#0000ff" },
  { name: "Фиолетовый", code: "#8000ff" },
  { name: "Белый", code: "#ffffff" }
];

// Названия 30 дней (можно потом переписать под свою доктрину)
const dayMeanings = [
  "День 1 — Атака",
  "День 2 — Движение",
  "День 3 — Стратегия",
  "День 4 — Дисциплина",
  "День 5 — Порядок",
  "День 6 — Манёвр",
  "День 7 — Подготовка",
  "День 8 — Прорыв",
  "День 9 — Укрепление",
  "День 10 — Перезагрузка",
  "День 11 — Разведка",
  "День 12 — Координация",
  "День 13 — Наступление",
  "День 14 — Снабжение",
  "День 15 — Закрепление",
  "День 16 — Контроль",
  "День 17 — Очистка",
  "День 18 — Усиление",
  "День 19 — Рефлексия",
  "День 20 — Баланс",
  "День 21 — Расширение",
  "День 22 — Консолидация",
  "День 23 — Перестройка",
  "День 24 — Смена курса",
  "День 25 — Стабилизация",
  "День 26 — Перенастройка",
  "День 27 — Калибровка",
  "День 28 — Сбор ресурсов",
  "День 29 — Спокойствие",
  "День 30 — Возрождение"
];

// Диапазоны реальных дат
const monthRanges = [
  { start: "2025-09-22", end: "2025-10-21" }, // Звезда
  { start: "2025-10-22", end: "2025-11-20" }, // Луна
  { start: "2025-11-21", end: "2025-12-20" }, // Небо
  { start: "2025-12-21", end: "2026-01-19" }, // Снег
  { start: "2026-01-20", end: "2026-02-18" }, // Вода
  { start: "2026-02-19", end: "2026-03-20" }, // Ветер
  { start: "2026-03-21", end: "2026-04-19" }, // Солнце
  { start: "2026-04-20", end: "2026-05-19" }, // Жизнь
  { start: "2026-05-20", end: "2026-06-18" }, // Огонь
  { start: "2026-06-19", end: "2026-07-18" }, // Земля
  { start: "2026-07-19", end: "2026-08-17" }, // Космос
  { start: "2026-08-18", end: "2026-09-16" }  // Эфир
].map(r => ({
  start: new Date(r.start + "T00:00:00"),
  end: new Date(r.end + "T23:59:59")
}));

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Получаем сегодняшнюю дату в системе Star Adam
function getStarAdamToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < monthRanges.length; i++) {
    const range = monthRanges[i];
    if (today >= range.start && today <= range.end) {
      const dayNumber = Math.floor((today - range.start) / MS_PER_DAY) + 1;
      return { monthIndex: i, dayNumber };
    }
  }
  return null;
}

// Реальная дата для любого дня Star Adam
function getRealDate(monthIndex, dayNumber) {
  const range = monthRanges[monthIndex];
  if (!range) return null;
  return new Date(range.start.getTime() + (dayNumber - 1) * MS_PER_DAY);
}

function formatDateRu(date) {
  const monthsRu = [
    "января","февраля","марта","апреля","мая","июня",
    "июля","августа","сентября","октября","ноября","декабря"
  ];
  return `${date.getDate()} ${monthsRu[date.getMonth()]} ${date.getFullYear()}`;
}

const starToday = getStarAdamToday();

let selectedCell = null;

// Создание карточки месяца
function createMonthCard(month, index) {
  const card = document.createElement("div");
  card.className = "month-card";

  const header = document.createElement("div");
  header.className = "month-header";

  const nameEl = document.createElement("div");
  nameEl.className = "month-name";
  nameEl.textContent = `${index + 1}. ${month.name}`;

  const datesEl = document.createElement("div");
  datesEl.className = "month-dates";
  datesEl.textContent = month.dates;

  const toggleEl = document.createElement("div");
  toggleEl.className = "month-toggle";
  toggleEl.textContent = index === 0 ? "свернуть" : "раскрыть";

  header.appendChild(nameEl);
  header.appendChild(datesEl);
  header.appendChild(toggleEl);

  const content = document.createElement("div");
  content.style.display = index === 0 ? "block" : "none";

  // 3 декады по 10 дней
  for (let d = 0; d < 3; d++) {
    const label = document.createElement("div");
    label.className = "dec-row-label";
    label.textContent = `Декада ${d + 1}`;
    content.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "dec-grid";

    for (let i = 1; i <= 10; i++) {
      const day = i + d * 10;
      const cell = document.createElement("div");
      cell.className = "day-cell";
      cell.textContent = day;

      // Подсветка сегодняшнего дня
      if (
        starToday &&
        starToday.monthIndex === index &&
        starToday.dayNumber === day
      ) {
        cell.classList.add("today");
      }

      // Клик по дню
      cell.addEventListener("click", () => {
        onDayClick(index, day, cell);
      });

      grid.appendChild(cell);
    }

    content.appendChild(grid);
  }

  header.addEventListener("click", () => {
    const isHidden = content.style.display === "none";
    content.style.display = isHidden ? "block" : "none";
    toggleEl.textContent = isHidden ? "свернуть" : "раскрыть";
  });

  card.appendChild(header);
  card.appendChild(content);
  return card;
}

function onDayClick(monthIndex, dayNumber, cell) {
  // Снимаем прошлый выбор
  if (selectedCell && selectedCell !== cell) {
    selectedCell.classList.remove("selected");
  }
  selectedCell = cell;
  cell.classList.add("selected");

  const month = months[monthIndex];
  const meaning =
    dayMeanings[dayNumber - 1] || `День ${dayNumber} — без названия`;
  const color = colorCycle[(dayNumber - 1) % 10];
  const real = getRealDate(monthIndex, dayNumber);

  const detailsEl = document.getElementById("dayDetails");
  const decada = Math.floor((dayNumber - 1) / 10) + 1;

  detailsEl.innerHTML = `
    Выбран: <b>${month.name}</b>, день <b>${dayNumber}</b> (Декада ${decada})<br>
    ${meaning}<br>
    Цвет недели: <b style="color:${color.code}">${color.name}</b><br>
    Реальная дата: <b>${real ? formatDateRu(real) : "вне диапазона года Звезды"}</b>
  `;
}

// Рендер всего приложения
function renderApp() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  months.forEach((m, idx) => {
    const card = createMonthCard(m, idx);
    app.appendChild(card);
  });

  const status = document.getElementById("todayStatus");
  if (starToday) {
    const m = months[starToday.monthIndex];
    const color = colorCycle[(starToday.dayNumber - 1) % 10];
    status.innerHTML = `
      Сегодня в Star Adam New Age:
      <b>${m.name}</b>, день <b>${starToday.dayNumber}</b>
      — цвет <b style="color:${color.code}">${color.name}</b>
    `;
  } else {
    status.textContent =
      "Сегодня вне диапазона календаря Star Adam New Age (год 2025–2026).";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderApp();

  // Музыка
  const music = document.getElementById("spaceMusic");
  const playBtn = document.getElementById("playMusic");
  let playing = false;

  playBtn.addEventListener("click", () => {
    if (!playing) {
      try {
        music.volume = 0.25;
        music.play();
      } catch (e) {}
      playBtn.textContent = "Музыка: Вкл";
    } else {
      music.pause();
      playBtn.textContent = "Музыка";
    }
    playing = !playing;
  });

  // Смена темы
  const themeBtn = document.getElementById("toggleTheme");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
  });
});
