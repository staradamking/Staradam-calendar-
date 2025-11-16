const months = [
  { name: "Звезда", dates: "22 сен – 21 окт 2025" },
  { name: "Луна", dates: "22 окт – 20 ноя 2025" },
  { name: "Небо", dates: "21 ноя – 20 дек 2025" },
  { name: "Снег", dates: "21 дек 2025 – 19 янв 2026" },
  { name: "Вода", dates: "20 янв – 18 фев 2026" },
  { name: "Ветер", dates: "19 фев – 20 мар 2026" },
  { name: "Солнце", dates: "21 мар – 19 апр 2026" },
  { name: "Жизнь", dates: "20 апр – 19 мая 2026" },
  { name: "Огонь", dates: "20 мая – 18 июн 2026" },
  { name: "Земля", dates: "19 июн – 18 июл 2026" },
  { name: "Космос", dates: "19 июл – 17 авг 2026" },
  { name: "Эфир", dates: "18 авг – 16 сен 2026" }
];

const dayFunctions = [
  "День 1 — Атака",
  "День 2 — Движение",
  "День 3 — Стратегия",
  "День 4 — Дисциплина",
  "День 5 — Созидание",
  "День 6 — Контроль",
  "День 7 — Порядок",
  "День 8 — Укрепление",
  "День 9 — Закрытие",
  "День 10 — Переход"
];

function createMonthCard(month, index) {
  const card = document.createElement("div");
  card.className = "month-card";

  const header = document.createElement("div");
  header.className = "month-header";

  const title = document.createElement("div");
  title.className = "month-name";
  title.textContent = `${index + 1}. ${month.name}`;

  const dates = document.createElement("div");
  dates.className = "month-dates";
  dates.textContent = month.dates;

  const toggle = document.createElement("div");
  toggle.className = "month-toggle";
  toggle.textContent = "раскрыть";

  header.appendChild(title);
  header.appendChild(dates);
  header.appendChild(toggle);

  const decadesContainer = document.createElement("div");
  decadesContainer.className = "decades";
  decadesContainer.style.display = "none";

  // 3 декады по 10 дней
  for (let d = 0; d < 3; d++) {
    const label = document.createElement("div");
    label.className = "dec-row-label";
    label.textContent = `Декада ${d + 1}`;
    decadesContainer.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "dec-grid";

    for (let i = 1; i <= 10; i++) {
      const dayNumber = i + d * 10;
      const cell = document.createElement("div");
      cell.className = "day-cell";
      cell.textContent = dayNumber;

      cell.addEventListener("click", () => onDayClick(card, month, dayNumber, cell));

      grid.appendChild(cell);
    }

    decadesContainer.appendChild(grid);
  }

  // Панель информации о дне
  const dayInfo = document.createElement("div");
  dayInfo.className = "day-info";
  dayInfo.style.display = "none";
  card.appendChild(header);
  card.appendChild(decadesContainer);
  card.appendChild(dayInfo);

  header.addEventListener("click", () => {
    const isHidden = decadesContainer.style.display === "none";
    decadesContainer.style.display = isHidden ? "block" : "none";
    toggle.textContent = isHidden ? "свернуть" : "раскрыть";
  });

  return card;
}

function onDayClick(card, month, dayNumber, cell) {
  // снять выделение со всех
  const allCells = card.querySelectorAll(".day-cell");
  allCells.forEach(c => c.classList.remove("selected"));
  cell.classList.add("selected");

  const decadeIndex = Math.floor((dayNumber - 1) / 10); // 0,1,2
  const funcIndex = (dayNumber - 1) % 10; // 0..9

  const infoBox = card.querySelector(".day-info");
  infoBox.style.display = "block";
  infoBox.innerHTML = `
    <div><b>${month.name}, день ${dayNumber}</b></div>
    <div>${dayFunctions[funcIndex]}</div>
    <div style="margin-top:4px; opacity:0.8;">Декада ${decadeIndex + 1}</div>
  `;
}

function renderApp() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  months.forEach((m, idx) => {
    const card = createMonthCard(m, idx);
    app.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderApp();

  const themeButton = document.getElementById("toggleTheme");
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light");
  });

  // Регистрация сервис-воркера
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(console.error);
  }
});
