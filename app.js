// ==== МЕСЯЦЫ STAR ADAM ====

const STAR_MONTHS = [
  {
    name: "ЗВЕЗДА",
    datesLabel: "22 сен – 21 окт 2025",
    start: "2025-09-22",
    end: "2025-10-21"
  },
  {
    name: "ЛУНА",
    datesLabel: "22 окт – 20 ноя 2025",
    start: "2025-10-22",
    end: "2025-11-20"
  },
  {
    name: "НЕБО",
    datesLabel: "21 ноя – 20 дек 2025",
    start: "2025-11-21",
    end: "2025-12-20"
  },
  {
    name: "СНЕГ",
    datesLabel: "21 дек 2025 – 19 янв 2026",
    start: "2025-12-21",
    end: "2026-01-19"
  },
  {
    name: "ВОДА",
    datesLabel: "20 янв – 18 фев 2026",
    start: "2026-01-20",
    end: "2026-02-18"
  },
  {
    name: "ВЕТЕР",
    datesLabel: "19 фев – 20 мар 2026",
    start: "2026-02-19",
    end: "2026-03-20"
  },
  {
    name: "СОЛНЦЕ",
    datesLabel: "21 мар – 19 апр 2026",
    start: "2026-03-21",
    end: "2026-04-19"
  },
  {
    name: "ЖИЗНЬ",
    datesLabel: "20 апр – 19 мая 2026",
    start: "2026-04-20",
    end: "2026-05-19"
  },
  {
    name: "ОГОНЬ",
    datesLabel: "20 мая – 18 июн 2026",
    start: "2026-05-20",
    end: "2026-06-18"
  },
  {
    name: "ЗЕМЛЯ",
    datesLabel: "19 июн – 18 июл 2026",
    start: "2026-06-19",
    end: "2026-07-18"
  },
  {
    name: "КОСМОС",
    datesLabel: "19 июл – 17 авг 2026",
    start: "2026-07-19",
    end: "2026-08-17"
  },
  {
    name: "ЭФИР",
    datesLabel: "18 авг – 16 сен 2026",
    start: "2026-08-18",
    end: "2026-09-16"
  }
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ==== Цвета 10-дневок + тотемы ====

const COLOR_CYCLE = [
  { name: "Чёрный", animal: "Пантера", emoji: "🐆" },
  { name: "Коричневый", animal: "Медведь", emoji: "🐻" },
  { name: "Красный", animal: "Дракон", emoji: "🐉" },
  { name: "Оранжевый", animal: "Лев", emoji: "🦁" },
  { name: "Жёлтый", animal: "Тигр", emoji: "🐯" },
  { name: "Зелёный", animal: "Аллигатор", emoji: "🐊" },
  { name: "Голубой", animal: "Дельфин", emoji: "🐬" },
  { name: "Синий", animal: "Кит", emoji: "🐋" },
  { name: "Фиолетовый", animal: "Фламинго", emoji: "🦩" },
  { name: "Белый", animal: "Лебедь", emoji: "🦢" }
];

// ==== Определяем сегодняшнюю дату в системе Star Adam ====

function parseDate(str) {
  return new Date(str + "T00:00:00");
}

STAR_MONTHS.forEach(m => {
  m.startDate = parseDate(m.start);
  m.endDate = new Date(m.end + "T23:59:59");
});

function getStarToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < STAR_MONTHS.length; i++) {
    const m = STAR_MONTHS[i];
    if (today >= m.startDate && today <= m.endDate) {
      const dayNumber =
        Math.floor((today - m.startDate) / MS_PER_DAY) + 1;
      return { monthIndex: i, dayNumber };
    }
  }
  return null;
}

let starToday = getStarToday();

// ==== Храним выполненные дни в localStorage ====

const STORAGE_KEY = "staradam_done_v1";
let doneMap = {};

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) doneMap = JSON.parse(saved);
} catch (e) {
  doneMap = {};
}

function doneKey(monthIndex, dayNumber) {
  return `${monthIndex}_${dayNumber}`;
}

function saveDone() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doneMap));
  } catch (e) {}
}

// ==== Фильтр: все / выполненные / невыполненные ====

let filterMode = "all"; // all | done | undone

// ==== РЕНДЕР ПРИЛОЖЕНИЯ ====

function renderApp() {
  const container = document.getElementById("monthsContainer");
  if (!container) return;
  container.innerHTML = "";

  // --- верхняя панель: сегодня ---

  const todayMonthEl = document.getElementById("todayMonth");
  const todayDayEl = document.getElementById("todayDay");
  const todayColorEl = document.getElementById("todayColor");

  if (starToday) {
    const m = STAR_MONTHS[starToday.monthIndex];
    const colorIndex = (starToday.dayNumber - 1) % 10;
    const color = COLOR_CYCLE[colorIndex];

    if (todayMonthEl) todayMonthEl.textContent = m.name;
    if (todayDayEl) todayDayEl.textContent = starToday.dayNumber;
    if (todayColorEl)
      todayColorEl.textContent =
        `${color.emoji} ${color.name} (${color.animal})`;
  } else {
    if (todayMonthEl) todayMonthEl.textContent = "";
    if (todayDayEl) todayDayEl.textContent = "";
    if (todayColorEl)
      todayColorEl.textContent = "вне года Звезды";
  }

  // --- карточки месяцев ---

  const totalDays = STAR_MONTHS.length * 30;
  let doneCount = 0;

  STAR_MONTHS.forEach((m, monthIndex) => {
    const card = document.createElement("div");
    card.className = "month-card";

    const header = document.createElement("div");
    header.className = "month-header";
    header.innerHTML = `
      <div class="month-name">${monthIndex + 1}. ${m.name}</div>
      <div class="month-dates">${m.datesLabel}</div>
    `;
    card.appendChild(header);

    const gridWrapper = document.createElement("div");

    // 3 декады по 10 дней
    for (let decade = 0; decade < 3; decade++) {
      const decadeTitle = document.createElement("div");
      decadeTitle.className = "decade-title";
      decadeTitle.textContent = `Декада ${decade + 1}`;
      gridWrapper.appendChild(decadeTitle);

      const grid = document.createElement("div");
      grid.className = "days-grid";

      for (let iDay = 1; iDay <= 10; iDay++) {
        const dayNumber = decade * 10 + iDay;
        const key = doneKey(monthIndex, dayNumber);
        const isDone = !!doneMap[key];
        if (isDone) doneCount++;

        const cell = document.createElement("div");
        cell.className = "day-cell";

        // цвета 10-дневки
        const colorIndex = (dayNumber - 1) % 10;
        cell.classList.add(`color-${colorIndex}`);

        cell.textContent = dayNumber;

        // сегодня
        if (
          starToday &&
          starToday.monthIndex === monthIndex &&
          starToday.dayNumber === dayNumber
        ) {
          cell.classList.add("today");
        }

        // выполнен
        if (isDone) {
          cell.classList.add("done");
        }

        // фильтр
        if (filterMode === "done" && !isDone) {
          cell.style.opacity = "0.25";
        } else if (filterMode === "undone" && isDone) {
          cell.style.opacity = "0.25";
        } else {
          cell.style.opacity = "1";
        }

        // клик по дню
        cell.addEventListener("click", () => {
          if (doneMap[key]) {
            delete doneMap[key];
          } else {
            doneMap[key] = true;
          }
          saveDone();
          renderApp();
        });

        grid.appendChild(cell);
      }

      gridWrapper.appendChild(grid);
    }

    card.appendChild(gridWrapper);
    container.appendChild(card);
  });

  // --- статистика ---

  const doneCountEl = document.getElementById("doneCount");
  const donePercentEl = document.getElementById("donePercent");
  if (doneCountEl) doneCountEl.textContent = doneCount;
  if (donePercentEl) {
    const percent = Math.round((doneCount / totalDays) * 100);
    donePercentEl.textContent = isNaN(percent) ? "0" : String(percent);
  }
}

// ==== КНОПКИ УПРАВЛЕНИЯ ====

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

  // Светлая/тёмная тема
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
    });
  }

  // TIGER режим
  if (tigerBtn) {
    tigerBtn.addEventListener("click", () => {
      const active = document.body.classList.toggle("tiger");
      tigerBtn.textContent = active ? "TIGER: ON" : "TIGER";
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

// ==== СТАРТ ====

document.addEventListener("DOMContentLoaded", () => {
  setupControls();
  renderApp();
});
