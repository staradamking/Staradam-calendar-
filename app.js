// ===== МЕСЯЦЫ STAR ADAM NEW AGE (12×30) =====

const months = [
  { name: "ЗВЕЗДA", dates: "22 сен – 21 окт 2025" },
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

// ===== 10-дневная цветовая неделя =====

const colorCycle = [
  { name: "Чёрный", code: "#000000", animal: "Пантера", emoji: "🐆" },
  { name: "Коричневый", code: "#7b3f00", animal: "Медведь", emoji: "🐻" },
  { name: "Красный", code: "#ff0000", animal: "Дракон", emoji: "🐉" },
  { name: "Оранжевый", code: "#ff7f00", animal: "Лев", emoji: "🦁" },
  { name: "Жёлтый", code: "#ffff00", animal: "Тигр", emoji: "🐯" },
  { name: "Зелёный", code: "#00ff00", animal: "Аллигатор", emoji: "🐊" },
  { name: "Голубой", code: "#33ccff", animal: "Дельфин", emoji: "🐬" },
  { name: "Синий", code: "#0000ff", animal: "Кит", emoji: "🐋" },
  { name: "Фиолетовый", code: "#8000ff", animal: "Фламинго", emoji: "🦩" },
  { name: "Белый", code: "#ffffff", animal: "Лебедь", emoji: "🦢" }
];

// ===== Реальные даты =====

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

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ===== Хранилище дисциплины =====

const DISC_KEY = "staradam_discipline_v1";
let doneMap = {};
try {
  const saved = localStorage.getItem(DISC_KEY);
  if (saved) doneMap = JSON.parse(saved);
} catch { doneMap = {}; }

// ===== ТЕМА =====

const THEME_KEY = "staradam_theme";
let themeMode = localStorage.getItem(THEME_KEY) || "dark";

function applyTheme() {
  document.body.classList.remove("light", "matrix");

  if (themeMode === "light") document.body.classList.add("light");
  if (themeMode === "matrix") document.body.classList.add("matrix");

  const btn = document.getElementById("toggleTheme");
  if (btn) {
    btn.textContent =
      themeMode === "dark"
        ? "Тема: Dark"
        : themeMode === "light"
        ? "Тема: Light"
        : "Тема: Matrix";
  }
}

// ===== ВСПОМОГАТЕЛЬНЫЕ =====

function getStarAdamToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < monthRanges.length; i++) {
    if (today >= monthRanges[i].start && today <= monthRanges[i].end) {
      const dayNumber = Math.floor((today - monthRanges[i].start) / MS_PER_DAY) + 1;
      return { monthIndex: i, dayNumber };
    }
  }
  return null;
}

const starToday = getStarAdamToday();

function getRealDate(monthIndex, dayNumber) {
  const d = new Date(monthRanges[monthIndex].start);
  d.setDate(d.getDate() + (dayNumber - 1));
  return d;
}

function dayKey(m, d) {
  return `${m}_${d}`;
}

// ===== СОЗДАНИЕ МЕСЯЦА =====

function createMonthCard(month, index) {
  const card = document.createElement("div");
  card.className = "month-card";

  const header = document.createElement("div");
  header.className = "month-header";
  header.innerHTML = `
    <div class="month-name">${index + 1}. ${month.name}</div>
    <div class="month-dates">${month.dates}</div>
    <div class="month-toggle">свернуть</div>
  `;

  const content = document.createElement("div");
  content.style.display = "block";

  for (let d = 0; d < 3; d++) {
    const lbl = document.createElement("div");
    lbl.className = "dec-row-label";
    lbl.textContent = `Декада ${d + 1}`;
    content.appendChild(lbl);

    const grid = document.createElement("div");
    grid.className = "dec-grid";

    for (let i = 1; i <= 10; i++) {
      const dayNumber = i + d * 10;
      const cell = document.createElement("div");
      const colorIndex = (dayNumber - 1) % 10;

      cell.className = `day-cell color-${colorIndex}`;
      cell.dataset.monthIndex = index;
      cell.dataset.dayNumber = dayNumber;
      cell.dataset.colorIndex = colorIndex;
      cell.textContent = dayNumber;

      // сегодня
      if (starToday &&
          starToday.monthIndex === index &&
          starToday.dayNumber === dayNumber) {
        cell.classList.add("today");
      }

      // выполнено
      if (doneMap[dayKey(index, dayNumber)]) {
        cell.classList.add("done");
      }

      cell.addEventListener("click", () =>
        onDayClick(index, dayNumber, cell)
      );

      grid.appendChild(cell);
    }

    content.appendChild(grid);
  }

  header.addEventListener("click", () => {
    const hidden = content.style.display === "none";
    content.style.display = hidden ? "block" : "none";
    header.querySelector(".month-toggle").textContent =
      hidden ? "свернуть" : "раскрыть";
  });

  card.appendChild(header);
  card.appendChild(content);

  return card;
}

// ===== КЛИК ПО ДНЮ =====

let selectedCell = null;
let selectedMeta = null;
let filterMode = "all";

function onDayClick(monthIndex, dayNumber, cell) {
  const key = dayKey(monthIndex, dayNumber);

  if (
    selectedMeta &&
    selectedMeta.monthIndex === monthIndex &&
    selectedMeta.dayNumber === dayNumber
  ) {
    const newState = !doneMap[key];
    if (newState) doneMap[key] = true;
    else delete doneMap[key];

    cell.classList.toggle("done", newState);
    localStorage.setItem(DISC_KEY, JSON.stringify(doneMap));

    updateStats();
    applyFilter();
  } else {
    if (selectedCell) selectedCell.classList.remove("selected");
    selectedCell = cell;
    selectedMeta = { monthIndex, dayNumber };
    cell.classList.add("selected");
  }

  const month = months[monthIndex];
  const color = colorCycle[(dayNumber - 1) % 10];
  const real = getRealDate(monthIndex, dayNumber);
  const decada = Math.floor((dayNumber - 1) / 10) + 1;

  const details = document.getElementById("dayDetails");
  details.classList.remove("hidden");

  details.innerHTML = `
    Выбран: <b>${month.name}</b>, день <b>${dayNumber}</b> (Декада ${decada})<br>
    День — ${color.emoji} <b>${color.name}</b> (${color.animal})<br>
    Реальная дата: <b>${real.toLocaleDateString("ru-RU")}</b><br>
    Статус дисциплины: <b>${doneMap[key] ? "ВЫПОЛНЕНО" : "не выполнено"}</b><br>
    <button class="add-to-calendar-btn" id="addToCalendarBtn">Добавить в календарь</button>
  `;

  document.getElementById("addToCalendarBtn").onclick = () =>
    createIcsEvent(month, dayNumber, color.name, real);
}

// ===== ICS =====

function createIcsEvent(month, dayNumber, meaning, date) {
  const pad = n => (n < 10 ? "0" + n : "" + n);

  const ds =
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate());

  const now = new Date();
  const stamp =
    now.getUTCFullYear().toString() +
    pad(now.getUTCMonth() + 1) +
    pad(now.getUTCDate()) +
    "T" +
    pad(now.getUTCHours()) +
    pad(now.getUTCMinutes()) +
    pad(now.getUTCSeconds()) +
    "Z";

  const ics =
    "BEGIN:VCALENDAR\r\n" +
    "VERSION:2.0\r\n" +
    "BEGIN:VEVENT\r\n" +
    "UID:" +
    stamp +
    "@staradam\r\n" +
    "DTSTAMP:" +
    stamp +
    "\r\n" +
    "DTSTART;VALUE=DATE:" +
    ds +
    "\r\n" +
    "SUMMARY:StarAdam " +
    month.name +
    " — день " +
    dayNumber +
    "\r\n" +
    "DESCRIPTION:" +
    meaning +
    "\r\n" +
    "END:VEVENT\r\n" +
    "END:VCALENDAR\r\n";

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "staradam.ics";
  a.click();
  URL.revokeObjectURL(url);
}

// ===== СТАТИСТИКА =====

function updateStats() {
  const el = document.getElementById("statsPanel");
  if (!el) return;

  const total = 12 * 30;
  const done = Object.keys(doneMap).length;
  el.innerHTML = `Дней выполнено: <b>${done}</b> из <b>${total}</b>`;
}

// ===== ФИЛЬТР =====

function applyFilter() {
  document.querySelectorAll(".day-cell").forEach(cell => {
    const m = parseInt(cell.dataset.monthIndex);
    const d = parseInt(cell.dataset.dayNumber);
    const done = !!doneMap[dayKey(m, d)];

    cell.classList.remove("filtered-out");

    if (filterMode === "done" && !done) cell.classList.add("filtered-out");
    if (filterMode === "undone" && done) cell.classList.add("filtered-out");
  });
}

// ===== РЕНДЕР =====

function renderApp() {
  const container = document.getElementById("monthsContainer");
  container.innerHTML = "";

  months.forEach((m, i) => container.appendChild(createMonthCard(m, i)));

  const status = document.getElementById("todayStatus");
  if (starToday) {
    const m = months[starToday.monthIndex];
    const color = colorCycle[(starToday.dayNumber - 1) % 10];
    status.innerHTML = `Сегодня: <b>${m.name}</b>, день <b>${
      starToday.dayNumber
    }</b> — ${color.emoji} <b>${color.name}</b>`;
  }

  updateStats();
  applyTheme();
  applyFilter();
}

// ===== INIT =====

document.addEventListener("DOMContentLoaded", () => {
  renderApp();

  const music = document.getElementById("spaceMusic");
  let playing = false;

  document.getElementById("playMusic").onclick = () => {
    if (!playing) {
      music.volume = 0.25;
      music.play();
      playing = true;
      playBtn.textContent = "Музыка: Вкл";
    } else {
      music.pause();
      playing = false;
      playBtn.textContent = "Музыка";
    }
  };

  document.getElementById("toggleTheme").onclick = () => {
    themeMode =
      themeMode === "dark" ? "light" : themeMode === "light" ? "matrix" : "dark";
    localStorage.setItem(THEME_KEY, themeMode);
    applyTheme();
  };

  document.getElementById("toggleTiger").onclick = () => {
    document.body.classList.toggle("tiger");
  };

  document.getElementById("toggleFilter").onclick = () => {
    if (filterMode === "all") filterMode = "done";
    else if (filterMode === "done") filterMode = "undone";
    else filterMode = "all";
    applyFilter();
  };
});
