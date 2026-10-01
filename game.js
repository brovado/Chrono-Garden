const STORAGE_KEY = "chrono-garden-save-v1";

const PLANTS = {
  rose: {
    name: "Rose",
    icon: "🌹",
    stages: [
      { at: 0, name: "Seed", icon: "🌱" },
      { at: 4, name: "Sprout", icon: "🌱" },
      { at: 12, name: "Young Rose", icon: "🌹" },
      { at: 24, name: "Rose", icon: "🌹" }
    ],
    mutations: [
      { name: "Golden Rose", icon: "🌼", at: 30 },
      { name: "Thorny Rose", icon: "🥀", at: 42 },
      { name: "Crystal Rose", icon: "💎", at: 60 }
    ]
  },
  sunflower: {
    name: "Sunflower",
    icon: "🌻",
    stages: [
      { at: 0, name: "Seed", icon: "🌱" },
      { at: 5, name: "Sprout", icon: "🌱" },
      { at: 14, name: "Young Sunflower", icon: "🌻" },
      { at: 26, name: "Sunflower", icon: "🌻" }
    ],
    mutations: [
      { name: "Golden Sunflower", icon: "✨", at: 34 },
      { name: "Radiant Sunflower", icon: "☀️", at: 52 },
      { name: "Celestial Sunflower", icon: "🌞", at: 72 }
    ]
  },
  mushroom: {
    name: "Mushroom",
    icon: "🍄",
    stages: [
      { at: 0, name: "Spore", icon: "🌱" },
      { at: 6, name: "Sprout", icon: "🌱" },
      { at: 16, name: "Young Mushroom", icon: "🍄" },
      { at: 28, name: "Mushroom", icon: "🍄" }
    ],
    mutations: [
      { name: "Glowing Mushroom", icon: "💡", at: 36 },
      { name: "Crystal Mushroom", icon: "💎", at: 55 },
      { name: "Ancient Mushroom", icon: "🪨", at: 76 }
    ]
  }
};

const starterChoices = Object.keys(PLANTS);

function defaultState() {
  return {
    gardenTime: 24,
    tickets: 100,
    nextPlantId: 4,
    plots: [
      makePlant("rose", 0),
      makePlant("sunflower", 0),
      makePlant("mushroom", 0),
      null, null, null
    ],
    discoveries: {
      rose: ["Rose"],
      sunflower: ["Sunflower"],
      mushroom: ["Mushroom"]
    }
  };
}

function makePlant(type, plantedAt) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type,
    plantedAt,
    mutationIndex: -1,
    lastMutationAt: null
  };
}

let state = loadState();

const gardenEl = document.getElementById("garden");
const timeEl = document.getElementById("garden-time");
const ticketsEl = document.getElementById("tickets");
const almanacEl = document.getElementById("almanac");
const statusEl = document.getElementById("garden-status");
const toastContainer = document.getElementById("toast-container");

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.warn("Save could not be loaded.", error);
  }
  return defaultState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatGardenTime(hours) {
  const totalMinutes = Math.floor(hours * 60);
  const days = Math.floor(totalMinutes / 1440);
  const remaining = totalMinutes % 1440;
  const hh = String(Math.floor(remaining / 60)).padStart(2, "0");
  const mm = String(remaining % 60).padStart(2, "0");
  return `Day ${days + 1} · ${hh}:${mm}`;
}

function getPlantAge(plant) {
  return Math.max(0, state.gardenTime - plant.plantedAt);
}

function getPlantVariant(plant) {
  const data = PLANTS[plant.type];
  const mutations = data.mutations;

  if (plant.mutationIndex >= 0) return mutations[plant.mutationIndex];

  let stage = data.stages[0];
  for (const candidate of data.stages) {
    if (getPlantAge(plant) >= candidate.at) stage = candidate;
  }
  return stage;
}

function render() {
  timeEl.textContent = formatGardenTime(state.gardenTime);
  ticketsEl.textContent = Math.floor(state.tickets).toLocaleString();

  const occupied = state.plots.filter(Boolean).length;
  statusEl.textContent = `${occupied}/${state.plots.length} plots`;

  gardenEl.innerHTML = "";

  state.plots.forEach((plant, index) => {
    const plot = document.createElement("div");
    plot.className = plant ? "plot" : "plot empty";

    if (!plant) {
      plot.innerHTML = `
        <div>
          <div>Empty plot</div>
          <button data-plant-plot="${index}">Plant something</button>
        </div>
      `;
      gardenEl.appendChild(plot);
      return;
    }

    const data = PLANTS[plant.type];
    const variant = getPlantVariant(plant);
    const age = getPlantAge(plant);
    const matureAt = data.stages[data.stages.length - 1].at;
    const progress = Math.min(100, (age / matureAt) * 100);
    const mutation = plant.mutationIndex >= 0 ? `<span class="mutation">Mutation discovered</span>` : "";

    plot.innerHTML = `
      <div>
        <span class="eyebrow">PLOT ${index + 1}</span>
        <div class="plant-icon">${variant.icon}</div>
        <div class="plant-name">${variant.name}</div>
        <div class="plant-age">Age: ${formatAge(age)}</div>
        ${mutation}
      </div>
      <div>
        <div class="growth"><span style="width:${progress}%"></span></div>
      </div>
    `;

    gardenEl.appendChild(plot);
  });

  renderAlmanac();
  saveState();
}

function formatAge(hours) {
  if (hours < 1) return "just planted";
  if (hours < 24) return `${Math.floor(hours)}h`;
  const days = Math.floor(hours / 24);
  const remainder = Math.floor(hours % 24);
  return `${days}d ${remainder}h`;
}

function renderAlmanac() {
  almanacEl.innerHTML = "";
  Object.entries(PLANTS).forEach(([key, data]) => {
    const discoveries = state.discoveries[key] || [];
    const row = document.createElement("div");
    row.className = "almanac-row";
    row.innerHTML = `
      <span>${data.name}</span>
      <span>${discoveries.length}/${data.mutations.length + 1} found</span>
    `;
    almanacEl.appendChild(row);
  });
}

function advanceTime(hours) {
  state.gardenTime += hours;
  checkMutations();
  render();
  toast(`The garden advanced ${formatAge(hours)}.`);
}

function checkMutations() {
  state.plots.forEach((plant) => {
    if (!plant) return;

    const data = PLANTS[plant.type];
    const age = getPlantAge(plant);
    const nextIndex = plant.mutationIndex + 1;
    const nextMutation = data.mutations[nextIndex];

    if (!nextMutation || age < nextMutation.at) return;

    // A mutation opportunity is guaranteed in this first playable slice
    // once the specimen crosses the discovery threshold. The system is
    // intentionally isolated so probability can replace this later.
    plant.mutationIndex = nextIndex;
    plant.lastMutationAt = state.gardenTime;

    if (!state.discoveries[plant.type]) state.discoveries[plant.type] = [data.name];
    if (!state.discoveries[plant.type].includes(nextMutation.name)) {
      state.discoveries[plant.type].push(nextMutation.name);
    }

    toast(`✨ Your ${data.name} became a ${nextMutation.name}!`);
  });
}

function plantInPlot(index, type) {
  if (state.plots[index]) return;
  state.plots[index] = makePlant(type, state.gardenTime);
  render();
  toast(`${PLANTS[type].name} planted. Now we wait.`);
}

gardenEl.addEventListener("click", (event) => {
  const button = event.target.closest("[data-plant-plot]");
  if (!button) return;

  const index = Number(button.dataset.plantPlot);
  const type = starterChoices[index % starterChoices.length];
  plantInPlot(index, type);
});

document.querySelectorAll("[data-deposit]").forEach((button) => {
  button.addEventListener("click", () => {
    const cost = Number(button.dataset.deposit);
    const hours = cost === 10 ? 1 : cost === 50 ? 6 : 24;

    if (state.tickets < cost) {
      toast("Not enough Tickets.", true);
      return;
    }

    state.tickets -= cost;
    advanceTime(hours);
  });
});

function toast(message, error = false) {
  const item = document.createElement("div");
  item.className = "toast";
  if (error) item.style.borderColor = "#8f5147";
  item.textContent = message;
  toastContainer.appendChild(item);
  setTimeout(() => item.remove(), 3000);
}

// --- Firefly mini-game ---

const miniArea = document.getElementById("mini-game-area");
const miniIdle = document.getElementById("mini-game-idle");
const startMiniGame = document.getElementById("start-mini-game");
const firefly = document.getElementById("firefly");
const miniHud = document.getElementById("mini-game-hud");
const miniTime = document.getElementById("mini-time");
const miniScore = document.getElementById("mini-score");
const miniResult = document.getElementById("mini-result");

let miniActive = false;
let miniScoreValue = 0;
let miniRemaining = 15;
let miniTimer = null;

startMiniGame.addEventListener("click", startFireflyGame);
firefly.addEventListener("click", catchFirefly);

function startFireflyGame() {
  if (miniActive) return;

  miniActive = true;
  miniScoreValue = 0;
  miniRemaining = 15;
  miniResult.textContent = "";
  miniIdle.hidden = true;
  firefly.hidden = false;
  miniHud.hidden = false;
  updateMiniHud();
  moveFirefly();

  miniTimer = setInterval(() => {
    miniRemaining -= 1;
    updateMiniHud();

    if (miniRemaining <= 0) endFireflyGame();
  }, 1000);
}

function updateMiniHud() {
  miniTime.textContent = miniRemaining;
  miniScore.textContent = miniScoreValue;
}

function moveFirefly() {
  const bounds = miniArea.getBoundingClientRect();
  const x = 15 + Math.random() * Math.max(20, bounds.width - 70);
  const y = 35 + Math.random() * Math.max(20, bounds.height - 90);
  firefly.style.left = `${x}px`;
  firefly.style.top = `${y}px`;
}

function catchFirefly(event) {
  event.stopPropagation();
  if (!miniActive) return;

  miniScoreValue += 1;
  updateMiniHud();
  moveFirefly();
}

function endFireflyGame() {
  clearInterval(miniTimer);
  miniActive = false;
  firefly.hidden = true;
  miniHud.hidden = true;
  miniIdle.hidden = false;

  const earned = Math.max(1, miniScoreValue * 3);
  state.tickets += earned;
  miniResult.textContent = `You caught ${miniScoreValue} fireflies and earned ${earned} Tickets.`;
  render();
}

render();
