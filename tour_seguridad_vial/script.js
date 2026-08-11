
const puntosRuta = [
  {
    id: 1,
    titulo: "Intersección con semáforo",
    lugar: "Tegucigalpa · Intersección",
    escena: "imagendelaluzroja.jpg",
    descripcion:
      "Juan se aproxima a una intersección con tráfico. Debe anticiparse a los vehículos y respetar el semáforo.",
    pregunta: "¿Qué debería hacer Juan?",
    a: "Reducir la velocidad y observar antes de avanzar.",
    b: "Acelerar para pasar rápidamente.",
    safe:
      "Reducir la velocidad permite tener más tiempo de reacción y observar el comportamiento de otros vehículos.",
    danger:
      "Acelerar en una intersección reduce el tiempo de reacción y aumenta el riesgo de una colisión.",
    consejo:
      "En una intersección, reducir la velocidad y anticipar los movimientos de otros usuarios ayuda a evitar conflictos.",
  },
  {
    id: 2,
    titulo: "Punto ciego de un bus",
    lugar: "Tegucigalpa · Avenida principal",
    escena: "imagendelpuntociego.jpg",
    descripcion:
      "Un bus circula junto a Juan y comienza a cambiar de trayectoria. Juan debe evitar permanecer en el punto ciego.",
    pregunta: "¿Qué debería hacer Juan?",
    a: "Reducir la velocidad y mantenerse fuera del punto ciego.",
    b: "Acelerar y adelantar al bus por el lado derecho.",
    safe:
      "Mantener distancia y salir del punto ciego da al motociclista mayor visibilidad y margen de reacción.",
    danger:
      "Intentar adelantar desde una zona de poca visibilidad puede hacer que el conductor del bus no vea a Juan.",
    consejo:
      "Evita circular durante mucho tiempo junto a buses y camiones. Busca una posición donde puedas ser visto.",
  },
  {
    id: 3,
    titulo: "Cruce peatonal",
    lugar: "Comayagüela · Zona urbana",
    escena: "imagendelpasopeatonak.jpg",
    descripcion:
      "Juan se aproxima a un cruce peatonal. Hay personas cerca de la calle y la visibilidad es limitada.",
    pregunta: "¿Qué debería hacer Juan?",
    a: "Disminuir la velocidad y estar preparado para detenerse.",
    b: "Continuar a la misma velocidad porque todavía no hay nadie cruzando.",
    safe:
      "Disminuir la velocidad permite reaccionar si un peatón entra repentinamente al cruce.",
    danger:
      "Mantener la velocidad puede dejar poco espacio para detenerse ante un peatón inesperado.",
    consejo:
      "Los cruces peatonales requieren anticipación: reducí la velocidad y mantené atención en ambos lados.",
  },
  {
    id: 4,
    titulo: "Lluvia y calle mojada",
    lugar: "Comayagüela · Calle mojada",
    escena: "imagendelluvia.jpg",
    descripcion:
      "Comienza a llover y el pavimento está mojado. La adherencia de las llantas disminuye.",
    pregunta: "¿Qué debería hacer Juan?",
    a: "Reducir la velocidad y aumentar la distancia de seguridad.",
    b: "Mantener la misma velocidad para llegar rápido.",
    safe:
      "Reducir la velocidad y aumentar la distancia ayuda a compensar la menor adherencia y visibilidad.",
    danger:
      "Con pavimento mojado se necesita más espacio para frenar y existe mayor riesgo de perder estabilidad.",
    consejo:
      "Con lluvia, reducí la velocidad, aumentá la distancia y evitá maniobras bruscas.",
  },
  {
    id: 5,
    titulo: "Distracción por celular",
    lugar: "Tegucigalpa · Zona comercial",
    escena: "imagendeltelefono.jpg",
    descripcion:
      "El celular de Juan recibe una notificación mientras conduce.",
    pregunta: "¿Qué debería hacer Juan?",
    a: "Ignorar la notificación y continuar concentrado.",
    b: "Revisar rápidamente el celular mientras avanza.",
    safe:
      "Ignorar el teléfono mantiene la atención en la vía y evita perder información visual importante.",
    danger:
      "Mirar el celular, aunque sea por unos segundos, puede hacer que Juan no detecte un peligro a tiempo.",
    consejo:
      "Las notificaciones pueden esperar. La atención debe permanecer en la conducción.",
  },
  {
    id: 6,
    titulo: "Equipo de protección",
    lugar: "Tegucigalpa · Llegada",
    escena: "imagendeproteccionono.jpg",
    descripcion:
      "Antes de finalizar el recorrido, Juan recuerda la importancia de utilizar correctamente su equipo de protección.",
    pregunta: "¿Cuál es la decisión más segura?",
    a: "Usar casco y equipo de protección.",
    b: "Manejar sin casco y sin equipo de proteccion.",
    safe:
      "El casco y el equipo de protección reducen el riesgo de lesiones en caso de una caída o colisión.",
    danger:
      "Un trayecto corto no elimina los riesgos. Una caída puede ocurrir en cualquier momento.",
    consejo:
      "El casco debe utilizarse correctamente y el equipo de protección debe formar parte de cada recorrido.",
  }
];

const ruta = [
  [14.0890, -87.2030],
  [14.0920, -87.2010],
  [14.0960, -87.2050],
  [14.0990, -87.2100],
  [14.1030, -87.2140],
  [14.1080, -87.2180],
  [14.1120, -87.2220]
];

let map;
let routeLine;
let markers = [];
let currentPoint = 0;
let completed = [];
let decisions = [];

const mapScreen = document.getElementById("mapScreen");
const sceneScreen = document.getElementById("sceneScreen");
const summaryScreen = document.getElementById("summaryScreen");

function showScreen(screen) {
  [mapScreen, sceneScreen, summaryScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");

  if (screen === mapScreen && map) {
    setTimeout(() => map.invalidateSize(), 200);
  }
}

function initMap() {
  map = L.map("map", {
    zoomControl: true,
    attributionControl: true
  }).setView([14.100, -87.212], 13);

  L.tileLayer("https://{s}.tile.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
     maxZoom: 19,
  }).addTo(map);

  routeLine = L.polyline(ruta, {
    color: "#1597ff",
    weight: 6,
    opacity: 0.7,
    dashArray: "8, 12",
    lineCap: "round"
  }).addTo(map);

  renderMarkers();
  map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
}

function createMarkerIcon(index) {
  let state = "locked";

  if (completed.includes(index)) {
    state = "completed";
  } else if (index === currentPoint) {
    state = "available";
  }

  return L.divIcon({
    className: "",
    html: `<div class="route-marker ${state}"><span>${index + 1}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
}

function renderMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  puntosRuta.forEach((punto, index) => {
    const marker = L.marker(ruta[index], {
      icon: createMarkerIcon(index),
      keyboard: false
    }).addTo(map);

    const disponible = index === currentPoint || completed.includes(index);

    marker.bindPopup(`
      <strong>${punto.id}. ${punto.titulo}</strong>
      <br><span>${punto.lugar}</span>
      ${disponible
        ? `<br><button class="popup-btn" onclick="openPoint(${index})">Ver situación</button>`
        : `<br><small>Completá los puntos anteriores.</small>`
      }
    `);

    marker.on("click", () => {
      if (disponible) {
        marker.openPopup();
      } else {
        alert("Este punto todavía está bloqueado. Completá primero el punto anterior.");
      }
    });

    markers.push(marker);
  });
}

function updateProgress() {
  const count = completed.length;
  const percent = (count / puntosRuta.length) * 100;

  document.getElementById("progressText").textContent =
    `${count} / ${puntosRuta.length}`;

  document.getElementById("progressBar").style.width = `${percent}%`;
}

function loadScene(index) {
  const punto = puntosRuta[index];

  currentPoint = index;

  document.getElementById("sceneLocation").textContent =
    `Punto ${punto.id} · ${punto.lugar}`;

  document.getElementById("panelNumber").textContent = punto.id;
  document.getElementById("panelTitle").textContent = punto.titulo;
  document.getElementById("panelDescription").textContent = punto.descripcion;
  document.getElementById("questionTitle").textContent = punto.pregunta;
  document.getElementById("choiceA").textContent = punto.a;
  document.getElementById("choiceB").textContent = punto.b;

  const scene = document.getElementById("sceneImage");
  const imagePath = `assets/${punto.escena}`;

  scene.style.backgroundImage = `url("${imagePath}")`;
  scene.classList.remove("has-image");

  // Si la imagen no existe, se mantiene el fondo de demostración.
  const testImage = new Image();
  testImage.onload = () => scene.classList.add("has-image");
  testImage.onerror = () => scene.classList.remove("has-image");
  testImage.src = imagePath;

  resetChoices();
  showScreen(sceneScreen);
}

function resetChoices() {
  document.querySelectorAll(".choice").forEach(btn => {
    btn.classList.remove("disabled");
  });

  const feedback = document.getElementById("feedback");
  feedback.className = "feedback hidden";
  feedback.innerHTML = "";

  document.getElementById("nextPointBtn").classList.add("hidden");
}

function answer(choice) {
  const punto = puntosRuta[currentPoint];
  const isSafe = choice === "safe";

  document.querySelectorAll(".choice").forEach(btn => {
    btn.classList.add("disabled");
  });

  if (!decisions[currentPoint]) {
    decisions[currentPoint] = {
      point: punto.id,
      title: punto.titulo,
      choice: isSafe ? "Decisión segura" : "Decisión de riesgo",
      safe: isSafe
    };
  }

  const feedback = document.getElementById("feedback");
  feedback.className = `feedback ${isSafe ? "safe" : "danger"}`;

  feedback.innerHTML = `
    <strong>${isSafe ? "✓ Decisión segura" : "⚠ Decisión de riesgo"}</strong>
    ${isSafe ? punto.safe : punto.danger}
  `;

  if (!completed.includes(currentPoint)) {
    completed.push(currentPoint);
  }

  updateProgress();

  const nextButton = document.getElementById("nextPointBtn");
  nextButton.classList.remove("hidden");

  if (currentPoint === puntosRuta.length - 1) {
    nextButton.innerHTML = `Ver resultados <span>→</span>`;
  } else {
    nextButton.innerHTML = `Continuar al siguiente punto <span>→</span>`;
  }

  renderMarkers();
}

function nextPoint() {
  if (currentPoint >= puntosRuta.length - 1) {
    showSummary();
    return;
  }

  loadScene(currentPoint + 1);
}

function showSummary() {
  const safeCount = decisions.filter(d => d && d.safe).length;

  document.getElementById("score").textContent =
    `${safeCount} / ${puntosRuta.length}`;

  document.getElementById("scoreMessage").textContent =
    safeCount === puntosRuta.length
      ? "¡Excelente! Tomaste decisiones seguras durante todo el recorrido."
      : "Revisá las situaciones de riesgo y recordá que pequeñas decisiones pueden prevenir accidentes.";

  const list = document.getElementById("decisionList");
  list.innerHTML = "";

  decisionesOrdenadas().forEach(d => {
    const div = document.createElement("div");
    div.className = `decision-item ${d.safe ? "safe" : "danger"}`;
    div.innerHTML = `
      <strong>Punto ${d.point} · ${d.title}</strong><br>
      ${d.choice}
    `;
    list.appendChild(div);
  });

  showScreen(summaryScreen);
}

function decisionesOrdenadas() {
  return puntosRuta
    .map((_, i) => decisions[i])
    .filter(Boolean);
}

function openPoint(index) {
  if (index > currentPoint && !completed.includes(index)) {
    alert("Completá primero el punto anterior.");
    return;
  }

  loadScene(index);
}

window.openPoint = openPoint;

document.getElementById("startBtn").addEventListener("click", () => {
  loadScene(0);
});

document.getElementById("backMapBtn").addEventListener("click", () => {
  showScreen(mapScreen);
});

document.getElementById("sceneMapBtn").addEventListener("click", () => {
  showScreen(mapScreen);
});

document.getElementById("hotspotMain").addEventListener("click", () => {
  document.getElementById("scenePanel").scrollTo({
    top: 0,
    behavior: "smooth"
  });

  document.getElementById("questionTitle").style.color = "#4cb4ff";
  setTimeout(() => {
    document.getElementById("questionTitle").style.color = "";
  }, 1000);
});

document.getElementById("hotspotInfo").addEventListener("click", () => {
  const punto = puntosRuta[currentPoint];

  document.getElementById("modalTitle").textContent = punto.titulo;
  document.getElementById("modalText").textContent = punto.consejo;
  document.getElementById("infoModal").classList.remove("hidden");
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("infoModal").classList.add("hidden");
});

document.getElementById("infoModal").addEventListener("click", e => {
  if (e.target.id === "infoModal") {
    e.currentTarget.classList.add("hidden");
  }
});

document.querySelectorAll(".choice").forEach(button => {
  button.addEventListener("click", () => {
    answer(button.dataset.choice);
  });
});

document.getElementById("nextPointBtn").addEventListener("click", nextPoint);

document.getElementById("resetMapBtn").addEventListener("click", () => {
  map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
});

document.getElementById("restartBtn").addEventListener("click", () => {
  currentPoint = 0;
  completed = [];
  decisions = [];
  updateProgress();
  renderMarkers();
  showScreen(mapScreen);
});

initMap();
updateProgress();
