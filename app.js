// ===== МЕСЯЦЫ STAR ADAM NEW AGE =====
// Порядок, который мы закрепили:
// 1 Звезда, 2 Луна, 3 Небо, 4 Снег, 5 Вода,
// 6 Ветер, 7 Солнце, 8 Жизнь, 9 Огонь, 10 Земля,
// 11 Космос, 12 Эфир

const STAR_MONTHS = [
  "ЗВЕЗДА",
  "ЛУНА",
  "НЕБО",
  "СНЕГ",
  "ВОДА",
  "ВЕТЕР",
  "СОЛНЦЕ",
  "ЖИЗНЬ",
  "ОГОНЬ",
  "ЗЕМЛЯ",
  "КОСМОС",
  "ЭФИР"
];

// ===== 10-дневный цветовой цикл + тотемы =====

const COLOR_CYCLE = [
  { name: "Чёрный",   animal: "Пантера",   emoji: "🐆" },
  { name: "Коричневый", animal: "Медведь", emoji: "🐻" },
  { name: "Красный",  animal: "Дракон",    emoji: "🐉" },
  { name: "Оранжевый", animal: "Лев",      emoji: "🦁" },
  { name: "Жёлтый",   animal: "Тигр",      emoji: "🐯" },
  { name: "Зелёный",  animal: "Аллигатор", emoji: "🐊" },
  { name: "Голубой",  animal: "Дельфин",   emoji: "🐬" },
  { name: "Синий",    animal: "Кит",       emoji: "🐋" },
  { name: "Фиолетовый", animal: "Фламинго", emoji: "🦩" },
  { name: "Белый",    animal: "Лебедь",    emoji: "🦢" }
];

// ===== Диапазоны реальных дат для каждого месяца Star Adam =====
// Все месяцы по 30 дней, год Звезды 2025–2026

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const MONTH_RANGES = [
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

// ===== Определяем: какой сегодня день в календаре Star Adam =====

function getStarToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < MONTH_RANGES.length; i++) {
    const range = MONTH_RANGES[i];
    if (today >= range.start && today <= range.end) {
      const dayNumber = Math.floor((today - range.start) / MS_PER_DAY) + 1;
      return { monthIndex: i, dayNumber };
    }
  }
  return null; // если дата вне года Звезды
}

const starToday = getStarToday();

// ===== Хранилище выполненных дней =====

const STORAGE_KEY = "staradam_done_v1";
let doneMap = {};

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    doneMap = JSON.parse(saved);
  }
} catch (e) {
  doneMap = {};
}

function saveDoneMap() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doneMap));
  } catch (e) {
    // ничего страшного, если localStorage не доступен
  }
}

function dayKey(monthIndex, dayNumber) {
  return `${monthIndex}_${dayNumber}`;
}

// ===== Режим фильтра: all / done / undone =====

let filterMode = "all";

// ===== Рендер всего приложения =====

function renderApp() {
  const container = document.getElementById("monthsContainer");
  if (!container) return;

  container.innerHTML = "";

  // --- Верхняя панель: "Сегодня ..." ---

  const todayMonthEl = document.getElementById("todayMonth");
  const todayDayEl = document.getElementById("todayDay");
  const todayColorEl = document.getElementById("todayColor");

  if (starToday) {
    const mName = STAR_MONTHS[starToday.monthIndex];
    const colorIndex = (starToday.dayNumber - 1) % 10;
    const color = COLOR_CYCLE[colorIndex];

    if (todayMonthEl) todayMonthEl.textContent = mName;
    if (todayDayEl) todayDayEl.textContent = starToday.dayNumber;
    if (todayColorEl)
      todayColorEl.textContent = `${color.emoji} ${color.name} (${color.animal})`;
  } else {
    if (todayMonthEl) todayMonthEl.textContent = "—";
    if (todayDayEl) todayDayEl.textContent = "—";
    if (todayColorEl) todayColorEl.textContent = "вне года Звезды";
  }

  // --- Карточки месяцев и дней ---

  const totalDays = STAR_MONTHS.length * 30;
  let doneCount = 0;

  STAR_MONTHS.forEach((name, monthIndex) => {
    const card = document.createElement("div");
    card.className = "month-card";

    const header = document.createElement("div");
    header.className = "month-header";
    header.innerHTML = `
      <span>${monthIndex + 1}. ${name}</span>
      <span></span>
    `;
    card.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "days-grid";

    for (let dayNumber = 1; dayNumber <= 30; dayNumber++) {
      const key = dayKey(monthIndex, dayNumber);
      const isDone = !!doneMap[key];
      if (isDone) doneCount++;

      const cell = document.createElement("div");
      cell.className = "day-cell";
      cell.textContent = dayNumber;

      // подсветка сегодняшнего
      if (
        starToday &&
        starToday.monthIndex === monthIndex &&
        starToday.dayNumber === dayNumber
      ) {
        cell.classList.add("today");
      }

      // выполненный день
      if (isDone) {
        cell.classList.add("done");
      }

      // фильтр
      if (filterMode === "done" && !isDone) {
        cell.style.opacity = "0.2";
      } else if (filterMode === "undone" && isDone) {
        cell.style.opacity = "0.2";
      } else {
        cell.style.opacity = "1";
      }

      // клик по дню — переключить выполнено/не выполнено
      cell.addEventListener("click", () => {
        const newState = !doneMap[key];
        if (newState) doneMap[key] = true;
        else delete doneMap[key];
        saveDoneMap();
        renderApp(); // перерендер, чтобы всё обновилось
      });

      grid.appendChild(cell);
    }

    card.appendChild(grid);
    container.appendChild(card);
  });

  // --- Статистика вверху: сколько дней выполнено ---

  const doneCountEl = document.getElementById("doneCount");
  const donePercentEl = document.getElementById("donePercent");
  if (doneCountEl) doneCountEl.textContent = doneCount;
  if (donePercentEl) {
    const percent = Math.round((doneCount / totalDays) * 100);
    donePercentEl.textContent = isNaN(percent) ? "0" : percent.toString();
  }
}

// ===== Кнопки управления =====

function setupControls() {
  const musicBtn = document.getElementById("musicBtn");
  const themeBtn = document.getElementById("themeBtn");
  const filterBtn = document.getElementById("filterBtn");
  const tigerBtn = document.getElementById("tigerBtn");
  const music = document.getElementById("bgMusic");

  // Музыка
  if (musicBtn && music) {
    musicBtn.addEventListener("click", () => {
      if (music.paused) {
        music.volume = 0.25;
        music.play().catch(() => {});
      } else {
        music.pause();
      }
    });
  }

  // Тема (light / dark)
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
    });
  }

  // TIGER режим (красный боевой)
  if (tigerBtn) {
    tigerBtn.addEventListener("click", () => {
      const on = document.body.classList.toggle("tiger");
      tigerBtn.textContent = on ? "TIGER: ON" : "TIGER";
    });
  }

  // Фильтр: все / выполненные / невыполненные
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      if (filterMode === "all") {
        filterMode = "done";
        filterBtn.textContent = "Фильтр: ✔";
      } else if (filterMode === "done") {
        filterMode = "undone";
        filterBtn.textContent = "Фильтр: ☐";
      } else {
        filterMode = "all";
        filterBtn.textContent = "Фильтр";
      }
      renderApp();
    });
  }
}

// ===== Старт =====

document.addEventListener("DOMContentLoaded", () => {
  setupControls();
  renderApp();
});
