// === ДАННЫЕ КАЛЕНДАРЯ ===

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

// 10 цветов + тотемы
const colorCycle = [
  {
    name: "Чёрный",
    totem: "Пантера",
    code: "#000000",
    meaning: "Пустота, концентрация, старт цикла"
  },
  {
    name: "Коричневый",
    totem: "Медведь",
    code: "#7b3f00",
    meaning: "Земля, база, устойчивость"
  },
  {
    name: "Красный",
    totem: "Дракон",
    code: "#ff0000",
    meaning: "Атака, сила, импульс"
  },
  {
    name: "Оранжевый",
    totem: "Лев",
    code: "#ff7f00",
    meaning: "Творчество, лидерство, сцена"
  },
  {
    name: "Жёлтый",
    totem: "Тигр",
    code: "#ffff00",
    meaning: "Фокус, ум, обучение"
  },
  {
    name: "Зелёный",
    totem: "Аллигатор",
    code: "#00ff00",
    meaning: "Жизнь, здоровье, восстановление"
  },
  {
    name: "Голубой",
    totem: "Дельфин",
    code: "#33ccff",
    meaning: "Коммуникация, связи, лёгкость"
  },
  {
    name: "Синий",
    totem: "Кит",
    code: "#0000ff",
    meaning: "Глубина, серьёзная работа, дисциплина"
  },
  {
    name: "Фиолетовый",
    totem: "Фламинго",
    code: "#8000ff",
    meaning: "Магия, необычные решения"
  },
  {
    name: "Белый",
    totem: "Лебедь",
    code: "#ffffff",
    meaning: "Очищение, завершение цикла"
  }
];

// Диапазоны реальных дат
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
const DISC_KEY = "staradam_discipline_v2";

let doneMap = {};
try {
  const saved = localStorage.getItem(DISC_KEY);
  if (saved) doneMap = JSON.parse(saved);
} catch (_) {}

let filterMode = "all"; // all | done | undone
let selectedMeta = null;
let selectedCell = null;
let todayCell = null;

const starToday = getStarAdamToday();

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

function getStarAdamToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < monthRanges.length; i++) {
    const range = monthRanges[i];
    if (today >= range.start && today <= range.end) {
      const dayNumber = Math.floor((today - range.start) / MS_PER_DAY) + 1;
      return { monthIndex: i, dayNumber, realDate: today };
    }
  }
  return null;
}

// исправленный расчёт реальной даты
function getRealDate(monthIndex, dayNumber) {
  const range = monthRanges[monthIndex];
  if (!range) return null;
  const d = new Date(range.start.getTime());
  d.setDate(d.getDate() + (dayNumber - 1));
  return d;
}

function formatDateRu(date) {
  const monthsRu = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
  ];
  return `${date.getDate()} ${
    monthsRu[date.getMonth()]
  } ${date.getFullYear()}`;
}

function dayKey(m, d) {
  return `${m}_${d}`;
}

function getColorForDay(dayNumber) {
  const idx = (dayNumber - 1) % 10;
  return colorCycle[idx];
}

// === РЕНДЕР МЕСЯЦЕВ ===

function createMonthCard(month, index) {
  const card = document.createElement("div");
  card.className = "month-card";
  card.dataset.monthIndex = index;

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

  for (let d = 0; d < 3; d++) {
    const label = document.createElement("div");
    label.className = "dec-row-label";
    label.textContent = `Декада ${d + 1}`;
    content.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "dec-grid";

    for (let i = 1; i <= 10; i++) {
      const dayNumber = i + d * 10;
      const cell = document.createElement("div");
      cell.className = "day-cell";
      cell.textContent = dayNumber;
      cell.dataset.monthIndex = index;
      cell.dataset.dayNumber = dayNumber;

      if (
        starToday &&
        starToday.monthIndex === index &&
        starToday.dayNumber === dayNumber
      ) {
        cell.classList.add("today");
        todayCell = cell;
        // раскрываем месяц с сегодняшним днём
        content.style.display = "block";
        toggleEl.textContent = "свернуть";
      }

      if (doneMap[dayKey(index, dayNumber)]) {
        cell.classList.add("done");
      }

      cell.addEventListener("click", () => onDayClick(index, dayNumber, cell));

      grid.appendChild(cell);
    }

    content.appendChild(grid);
  }

  header.addEventListener("click", () => {
    const hidden = content.style.display === "none";
    content.style.display = hidden ? "block" : "none";
    toggleEl.textContent = hidden ? "свернуть" : "раскрыть";
  });

  card.appendChild(header);
  card.appendChild(content);
  return card;
}

// === КЛИК ПО ДНЮ ===

function onDayClick(monthIndex, dayNumber, cell) {
  const key = dayKey(monthIndex, dayNumber);

  if (
    selectedMeta &&
    selectedMeta.monthIndex === monthIndex &&
    selectedMeta.dayNumber === dayNumber
  ) {
    const newState = !doneMap[key];
    if (newState) {
      doneMap[key] = true;
      cell.classList.add("done");
    } else {
      delete doneMap[key];
      cell.classList.remove("done");
    }
    try {
      localStorage.setItem(DISC_KEY, JSON.stringify(doneMap));
    } catch (_) {}

    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  } else {
    if (selectedCell && selectedCell !== cell) {
      selectedCell.classList.remove("selected");
    }
    cell.classList.add("selected");
    selectedCell = cell;
    selectedMeta = { monthIndex, dayNumber };
  }

  applyFilter();
  updateInfoPanel();
}

// === ИНФО-ПАНЕЛЬ ===

function updateInfoPanel() {
  const info = document.getElementById("infoContent");
  const totalDays = months.length * 30;
  const doneCount = Object.keys(doneMap).length;
  const percent = Math.round((doneCount * 100) / totalDays);

  let todayLine = "";
  if (starToday) {
    const m = months[starToday.monthIndex];
    const col = getColorForDay(starToday.dayNumber);
    todayLine = `
      <div class="info-row">
        Сегодня в Star Adam New Age:
        <b>${m.name}</b>, день <b>${starToday.dayNumber}</b>
        — цвет <b class="info-highlight">${col.name}</b>
        (${col.totem})
      </div>
      <div class="info-row info-small">
        Реальная дата сегодня: <b>${formatDateRu(
          starToday.realDate
        )}</b>
      </div>
    `;
  } else {
    todayLine = `
      <div class="info-row">
        Сегодня вне диапазона года Звезды (2025–2026).
      </div>
    `;
  }

  let selectedLine = "";
  if (selectedMeta) {
    const { monthIndex, dayNumber } = selectedMeta;
    const m = months[monthIndex];
    const real = getRealDate(monthIndex, dayNumber);
    const c = getColorForDay(dayNumber);
    const done = !!doneMap[dayKey(monthIndex, dayNumber)];
    const decada = Math.floor((dayNumber - 1) / 10) + 1;

    selectedLine = `
      <div class="info-row">
        Выбран: <b>${m.name}</b>, день <b>${dayNumber}</b> (Декада ${decada})
      </div>
      <div class="info-row">
        День ${dayNumber} — <b>${c.name}</b> (${c.totem})
      </div>
      <div class="info-row">
        Реальная дата: <b>${
          real ? formatDateRu(real) : "вне диапазона года Звезды"
        }</b>
      </div>
      <div class="info-row">
        Статус дисциплины:
        <b>${done ? "ВЫПОЛНЕНО" : "пока не выполнено"}</b>
      </div>
      <div class="info-row info-small">
        Нажми ещё раз по этому дню в календаре, чтобы переключить статус.
      </div>
    `;
  } else {
    selectedLine = `
      <div class="info-row">
        День не выбран. Нажми на любой день в календаре.
      </div>
    `;
  }

  const statsLine = `
    <div class="info-row">
      Дней выполнено: <b>${doneCount}</b> из <b>${totalDays}</b> (${percent}%)
    </div>
  `;

  const colorLegend = `
    <div class="color-totems">
      <div class="color-totems-title">Цвета и тотемы декады Star Adam:</div>
      <div class="color-totems-grid">
        ${colorCycle
          .map(
            (c, i) =>
              `<div><b>${i + 1}. ${c.name}</b> — ${c.totem}</div>`
          )
          .join("")}
      </div>
    </div>
  ";

  info.innerHTML = todayLine + selectedLine + statsLine + colorLegend;
}

// === ФИЛЬТР ===

function applyFilter() {
  const cells = document.querySelectorAll(".day-cell");
  cells.forEach(cell => {
    cell.classList.remove("filtered-out");
    const m = parseInt(cell.dataset.monthIndex, 10);
    const d = parseInt(cell.dataset.dayNumber, 10);
    const isDone = !!doneMap[dayKey(m, d)];
    if (filterMode === "done" && !isDone) {
      cell.classList.add("filtered-out");
    } else if (filterMode === "undone" && isDone) {
      cell.classList.add("filtered-out");
    }
  });
}

// === РЕНДЕР ПРИЛОЖЕНИЯ ===

function renderApp() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  months.forEach((m, idx) => {
    const card = createMonthCard(m, idx);
    app.appendChild(card);
  });
  updateInfoPanel();
}

// === СКРОЛЛ К СЕГОДНЯ ===

function scrollToToday() {
  if (!todayCell) return;
  const content = todayCell.closest(".month-card");
  if (content) {
    content.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// === ИНИЦИАЛИЗАЦИЯ ===

document.addEventListener("DOMContentLoaded", () => {
  renderApp();

  const infoPanel = document.getElementById("infoPanel");
  const infoToggle = document.getElementById("infoToggle");
  const appTitle = document.getElementById("appTitle");

  infoToggle.addEventListener("click", () => {
    const open = infoPanel.classList.toggle("open");
    infoToggle.classList.toggle("active", open);
  });

  // скрытая кнопка "Сегодня" — по нажатию на заголовок
  appTitle.addEventListener("click", () => {
    scrollToToday();
  });

  // НИЖНЯЯ ПАНЕЛЬ

  const music = document.getElementById("spaceMusic");
  const playBtn = document.getElementById("playMusic");
  const themeBtn = document.getElementById("toggleTheme");
  const filterBtn = document.getElementById("toggleFilter");
  const tigerBtn = document.getElementById("toggleTiger");

  let playing = false;
  const autoMusic = localStorage.getItem("starMusicAuto") === "1";

  if (autoMusic) {
    const autoStart = () => {
      if (!playing) {
        music.volume = 0.25;
        music.play().catch(() => {});
        playing = true;
        playBtn.classList.add("music-on");
      }
    };
    document.addEventListener("touchstart", autoStart, { once: true });
    document.addEventListener("click", autoStart, { once: true });
  }

  playBtn.addEventListener("click", () => {
    if (!playing) {
      music.volume = 0.25;
      music.play().catch(() => {});
      playing = true;
      playBtn.classList.add("music-on");
      localStorage.setItem("starMusicAuto", "1");
    } else {
      music.pause();
      playing = false;
      playBtn.classList.remove("music-on");
      localStorage.setItem("starMusicAuto", "0");
    }
  });

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("matrix");
  });

  filterBtn.addEventListener("click", () => {
    if (filterMode === "all") {
      filterMode = "done";
      filterBtn.textContent = "Фильтр: ✔";
      filterBtn.classList.remove("filter-undone");
      filterBtn.classList.add("filter-done");
    } else if (filterMode === "done") {
      filterMode = "undone";
      filterBtn.textContent = "Фильтр: ☐";
      filterBtn.classList.remove("filter-done");
      filterBtn.classList.add("filter-undone");
    } else {
      filterMode = "all";
      filterBtn.textContent = "Фильтр";
      filterBtn.classList.remove("filter-done", "filter-undone");
    }
    applyFilter();
  });

  tigerBtn.addEventListener("click", () => {
    const on = document.body.classList.toggle("tiger");
    tigerBtn.textContent = on ? "TIGER: ON" : "TIGER";
    tigerBtn.classList.toggle("tiger-on", on);
  });
});
