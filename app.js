// ===== МЕСЯЦЫ STAR ADAM NEW AGE (12×30) =====

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

// ===== 10-дневная цветовая неделя и тотемы =====

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

// ===== Реальные диапазоны дат для каждого месяца =====

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

// ===== Хранилище дисциплины =====

const DISC_KEY = "staradam_discipline_v1";
let doneMap = {};
try {
  const saved = localStorage.getItem(DISC_KEY);
  if (saved) doneMap = JSON.parse(saved);
} catch {
  doneMap = {};
}

// ===== ТЕМА (Dark / Light / Matrix) =====

const THEME_KEY = "staradam_theme";
let themeMode = localStorage.getItem(THEME_KEY) || "dark"; // dark | light | matrix

function applyTheme() {
  document.body.classList.remove("light", "matrix");
  if (themeMode === "light") document.body.classList.add("light");
  if (themeMode === "matrix") document.body.classList.add("matrix");

  const btn = document.getElementById("toggleTheme");
  if (btn) {
    const label =
      themeMode === "dark"
        ? "Тема: Dark"
        : themeMode === "light"
        ? "Тема: Light"
        : "Тема: Matrix";
    btn.textContent = label;
  }
}

// состояние выбора / фильтра
let selectedCell = null;
let selectedMeta = null;
let filterMode = "all";

const starToday = getStarAdamToday();

// ===== ВСПОМОГАТЕЛЬНЫЕ =====

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
  return `${date.getDate()} ${monthsRu[date.getMonth()]} ${date.getFullYear()}`;
}

function dayKey(monthIndex, dayNumber) {
  return `${monthIndex}_${dayNumber}`;
}

// ===== СОЗДАНИЕ КАРТОЧКИ МЕСЯЦА =====

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
  toggleEl.textContent = "свернуть";

  header.appendChild(nameEl);
  header.appendChild(datesEl);
  header.appendChild(toggleEl);

  const content = document.createElement("div");
  content.style.display = "block";

  // 3 декады по 10 дней
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

      const colorIndex = (dayNumber - 1) % 10;
      cell.classList.add(`color-${colorIndex}`);
      cell.dataset.colorIndex = colorIndex;

      cell.dataset.monthIndex = index;
      cell.dataset.dayNumber = dayNumber;
      cell.textContent = dayNumber;

      if (
        starToday &&
        starToday.monthIndex === index &&
        starToday.dayNumber === dayNumber
      ) {
        cell.classList.add("today");
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
    const isHidden = content.style.display === "none";
    content.style.display = isHidden ? "block" : "none";
    toggleEl.textContent = isHidden ? "свернуть" : "раскрыть";
  });

  card.appendChild(header);
  card.appendChild(content);
  return card;
}

// ===== КЛИК ПО ДНЮ =====

function onDayClick(monthIndex, dayNumber, cell) {
  const key = dayKey(monthIndex, dayNumber);

  // повторный клик по выбранному дню — переключаем выполнено
  if (
    selectedMeta &&
    selectedMeta.monthIndex === monthIndex &&
    selectedMeta.dayNumber === dayNumber
  ) {
    const newState = !doneMap[key];
    if (newState) {
      doneMap[key] = true;
    } else {
      delete doneMap[key];
    }
    cell.classList.toggle("done", !!newState);

    try {
      localStorage.setItem(DISC_KEY, JSON.stringify(doneMap));
    } catch {
      /* ignore */
    }

    updateStats();
    applyFilter();
  } else {
    // просто выделяем
    if (selectedCell && selectedCell !== cell) {
      selectedCell.classList.remove("selected");
    }
    cell.classList.add("selected");
    selectedCell = cell;
    selectedMeta = { monthIndex, dayNumber };
  }

  const month = months[monthIndex];
  const colorIndex = (dayNumber - 1) % 10;
  const color = colorCycle[colorIndex];
  const real = getRealDate(monthIndex, dayNumber);
  const decada = Math.floor((dayNumber - 1) / 10) + 1;
  const done = !!doneMap[key];

  const meaningLine = `День ${dayNumber} — ${color.emoji} ${color.name} (${color.animal})`;

  const detailsEl = document.getElementById("dayDetails");
  if (!detailsEl) return;

  // показываем панель, если она была скрыта
  detailsEl.classList.remove("hidden");

  detailsEl.innerHTML = `
    Выбран: <b>${month.name}</b>, день <b>${dayNumber}</b> (Декада ${decada})<br>
    ${meaningLine}<br>
    Реальная дата: <b>${
      real ? formatDateRu(real) : "вне диапазона года Звезды"
    }</b><br>
    Статус дисциплины: <b>${
      done ? "ВЫПОЛНЕНО" : "пока не выполнено"
    }</b><br>
    <span style="opacity:0.8;font-size:11px;">Нажми ещё раз по этому дню, чтобы переключить статус.</span><br>
    ${
      real
        ? '<button class="add-to-calendar-btn" id="addToCalendarBtn">Добавить в календарь</button>'
        : ""
    }
  `;

  const btn = document.getElementById("addToCalendarBtn");
  if (btn && real) {
    btn.addEventListener("click", () =>
      createIcsEvent(month, dayNumber, meaningLine, real)
    );
  }
}

// ===== СОЗДАНИЕ ICS-СОБЫТИЯ =====

function createIcsEvent(month, dayNumber, meaningLine, date) {
  const pad = n => (n < 10 ? "0" + n : "" + n);

  const dateStr =
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

  const summary = `StarAdam: ${month.name}, день ${dayNumber}`;
  const desc = meaningLine.replace(/\n/g, " ");

  const ics =
    "BEGIN:VCALENDAR\r\n" +
    "VERSION:2.0\r\n" +
    "PRODID:-//StarAdam//NewAge//RU\r\n" +
    "BEGIN:VEVENT\r\n" +
    "UID:" +
    stamp +
    "@staradam\r\n" +
    "DTSTAMP:" +
    stamp +
    "\r\n" +
    "DTSTART;VALUE=DATE:" +
    dateStr +
    "\r\n" +
    "SUMMARY:" +
    summary +
    "\r\n" +
    "DESCRIPTION:" +
    desc +
    "\r\n" +
    "END:VEVENT\r\n" +
    "END:VCALENDAR\r\n";

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "staradam-day.ics";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
}

// ===== СТАТИСТИКА =====

function updateStats() {
  const statsEl = document.getElementById("statsPanel");
  if (!statsEl) return;

  const totalDays = months.length * 30;
  const doneCount = Object.keys(doneMap).length;
  const percent = Math.round((doneCount * 100) / totalDays);

  statsEl.innerHTML = `Дней выполнено: <b>${doneCount}</b> из <b>${totalDays}</b> (${percent}%)`;
}

// ===== ФИЛЬТР =====

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

// ===== РЕНДЕР =====

function renderApp() {
  const container = document.getElementById("monthsContainer");
  if (!container) return;
  container.innerHTML = "";

  months.forEach((m, idx) => {
    const card = createMonthCard(m, idx);
    container.appendChild(card);
  });

  const status = document.getElementById("todayStatus");
  if (status) {
    if (starToday) {
      const m = months[starToday.monthIndex];
      const color = colorCycle[(starToday.dayNumber - 1) % 10];
      status.innerHTML = `Сегодня в Star Adam New Age: <b>${
        m.name
      }</b>, день <b>${starToday.dayNumber}</b> — ${
        color.emoji
      } <span style="color:${color.code}"><b>${color.name}</b></span> (${color.animal})`;
    } else {
      status.textContent =
        "Сегодня вне диапазона календаря Star Adam New Age (год 2025–2026).";
    }
  }

  updateStats();
  applyFilter();
}

// ===== ИНИЦИАЛИЗАЦИЯ =====

document.addEventListener("DOMContentLoaded", () => {
  // применяем тему до рендера
  applyTheme();
  renderApp();

  // по умолчанию инфо-панель скрыта
  const detailsEl = document.getElementById("dayDetails");
  if (detailsEl) {
    detailsEl.classList.add("hidden");
    detailsEl.innerHTML = "";
  }

  // Музыка — ТОЛЬКО ПО КЛИКУ, БЕЗ АВТОСТАРТА
  const music = document.getElementById("spaceMusic");
  const playBtn = document.getElementById("playMusic");
  let playing = false;

  if (playBtn && music) {
    playBtn.addEventListener("click", () => {
      if (!playing) {
        music.volume = 0.25;
        music.play().catch(() => {});
        playing = true;
        playBtn.textContent = "Музыка: Вкл";
      } else {
        music.pause();
        playing = false;
        playBtn.textContent = "Музыка";
      }
    });
  }

  // Переключатель темы: Dark → Light → Matrix → Dark
  const themeBtn = document.getElementById("toggleTheme");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      if (themeMode === "dark") themeMode = "light";
      else if (themeMode === "light") themeMode = "matrix";
      else themeMode = "dark";
      localStorage.setItem(THEME_KEY, themeMode);
      applyTheme();
    });
  }

  // TIGER режим
  const tigerBtn = document.getElementById("toggleTiger");
  if (tigerBtn) {
    tigerBtn.addEventListener("click", () => {
      const on = document.body.classList.toggle("tiger");
      tigerBtn.textContent = on ? "TIGER: ON" : "TIGER";
      tigerBtn.classList.toggle("tiger-btn", on);
    });
  }

  // Фильтр
  const filterBtn = document.getElementById("toggleFilter");
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
      applyFilter();
    });
  }
});
