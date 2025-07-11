document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("planet-nav");
  const main = document.getElementById("main-content");
  const themeToggle = document.getElementById("theme-toggle");
  const appWrapper = document.getElementById("app");
  const loader = document.getElementById("loader");
  const yearEl = document.getElementById("year");

  let planets = [];
  let currentPlanetIndex = 0;
  let currentTab = "overview";

  // Set current year in footer
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Set initial theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  appWrapper.setAttribute("data-theme", savedTheme);

  // Toggle theme
  themeToggle?.addEventListener("click", () => {
    const current = appWrapper.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    appWrapper.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // Load data
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      planets = data;
      loader.style.display = "none";
      renderNav();
      renderPlanet();
    })
    .catch(error => {
      loader.innerHTML = `<p style="color: red;">Error loading planet data ❌</p>`;
      console.error("Data load failed:", error);
    });

  // Render navigation
  function renderNav() {
    nav.innerHTML = planets
      .map((planet, index) => `
        <li>
          <a href="#" class="${index === currentPlanetIndex ? "active" : ""}" data-index="${index}">
            ${planet.name.toUpperCase()}
          </a>
        </li>
      `)
      .join("");

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        currentPlanetIndex = +link.dataset.index;
        currentTab = "overview";
        renderPlanet();
      });
    });
  }

  // Render tabs
  function renderTabs() {
    const tabList = ["overview", "structure", "geology"];
    return `
      <div class="tabs">
        ${tabList.map(tab => `
          <button class="tab ${currentTab === tab ? "active" : ""}" data-tab="${tab}">
            ${tabList.indexOf(tab) + 1}. ${tab.toUpperCase()}
          </button>
        `).join("")}
      </div>
    `;
  }

  // Render current planet
  function renderPlanet() {
    const planet = planets[currentPlanetIndex];
    const content = planet.description[currentTab] || "Content unavailable.";
    const image = planet.images[currentTab] || planet.images.overview;

    main.innerHTML = `
      <section class="planet-header">
        <img src="${image}" alt="${planet.name} ${currentTab}" class="planet-img" />
        <div>
          <h2 class="planet-name">${planet.name}</h2>
          ${renderTabs()}
          <div class="planet-content">
            <p>${content}</p>
            <p><small>Source: <a href="${planet.source}" target="_blank" rel="noopener noreferrer">Wikipedia ↗</a></small></p>
          </div>
        </div>
      </section>

      <section class="facts">
        ${renderFacts(planet.facts)}
      </section>
    `;

    // Tab buttons events
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        currentTab = tab.dataset.tab;
        renderPlanet();
      });
    });

    // Re-render nav active state
    renderNav();
  }

  // Render facts
  function renderFacts(facts) {
    return Object.entries(facts).map(([key, value]) => `
      <div class="fact-box">
        <strong>${key.replace(/_/g, " ").toUpperCase()}</strong>
        ${value}
      </div>
    `).join("");
  }
});
