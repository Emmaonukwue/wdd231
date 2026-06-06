// Footer year and last modified
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent =
  "Last Modified: " + document.lastModified;

// Fetch members and display (only if container exists)
async function loadMembers() {
  try {
    const container = document.getElementById("membersContainer");
    if (!container) return; // Skip if not on directory page

    const response = await fetch("data/members.json");
    const members = await response.json();

    container.innerHTML = "";

    members.forEach(member => {
      let label = ""
      if (member.membership === 3) label = "gold";
      else if (member.membership === 2) label = "silver";
      else label = "member";
      
      const card = document.createElement("div");
      card.classList.add("card");

      

      card.innerHTML = `
        <div class="thumb">
          <img src="images/${member.image}" alt="${member.name}">
        </div>
        <div class="meta">
          <h3>${member.name}</h3>
          <p>${member.address}</p>
          <p>${member.phone}</p>
          <a href="${member.website}" target="_blank">Visit Website</a>
          <br>
          <span class="badge ${label}">${label}</span>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading members:", err);
  }
}
loadMembers();

// Spotlight: show 2–3 random gold/silver members on homepage
async function loadSpotlight() {
  const container = document.getElementById("spotlight-container");
  if (!container) return;

  try {
    const response = await fetch("data/members.json");
    const members = await response.json();

    // Normalize membership levels
    members.forEach(m => {
      if (m.membership === 3) m.level = "gold";
      else if (m.membership === 2) m.level = "silver";
      else m.level = "member";
    });

    // Filter only gold/silver
    const premium = members.filter(m => m.level === "gold" || m.level === "silver");

    // Shuffle and pick 2–3
    const selection = premium.sort(() => 0.5 - Math.random()).slice(0, 3);

    container.innerHTML = "";
    selection.forEach(member => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="thumb">
          <img src="images/${member.image}" alt="${member.name}">
        </div>
        <div class="meta">
          <h3>${member.name}</h3>
          <p>${member.note}</p>
          <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
          <span class="badge ${member.level}">${member.level}</span>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading spotlight:", err);
  }
}
loadSpotlight();


// Toggle grid / list view (only if buttons exist)
const gridBtn = document.getElementById("gridBtn");
const listBtn = document.getElementById("listBtn");
const directory = document.getElementById("membersContainer");

if (gridBtn && listBtn && directory) {
  gridBtn.addEventListener("click", () => {
    directory.classList.add("grid");
    directory.classList.remove("list");
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
  });

  listBtn.addEventListener("click", () => {
    directory.classList.add("list");
    directory.classList.remove("grid");
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
  });
}

// Hamburger menu
const hamburger = document.querySelector(".hamburger");
const mainNav = document.querySelector(".main-nav");
if (hamburger && mainNav) {
  hamburger.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    const expanded = hamburger.getAttribute("aria-expanded") === "true" || false;
    hamburger.setAttribute("aria-expanded", !expanded);
  });
}

// Weather API (OpenWeatherMap demo) – only if weather section exists
const currentWeather = document.getElementById("current-weather");
const forecastList = document.getElementById("forecast-list");

if (currentWeather && forecastList) {
  const apiKey = "4b41eb525012c29a62f987097eac8614"; // replace with your API key
  const city = "Lagos";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  async function fetchWeather() {
    try {
      // Current weather
      const response = await fetch(weatherUrl);
      const data = await response.json();
      currentWeather.textContent = `${data.weather[0].description}, ${data.main.temp}°C`;

      // Forecast
      const fResponse = await fetch(forecastUrl);
      const fData = await fResponse.json();
      forecastList.innerHTML = "";

      const noonForecasts = fData.list.filter(item => item.dt_txt.includes("12:00:00"));
      noonForecasts.slice(0, 3).forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${new Date(item.dt_txt).toLocaleDateString()}: ${item.main.temp}°C, ${item.weather[0].description}`;
        forecastList.appendChild(li);
      });
    } catch (error) {
      currentWeather.textContent = "Unable to load weather.";
      forecastList.innerHTML = "<li>Error loading forecast.</li>";
    }
  }

  fetchWeather();
}


// Set hidden timestamp to current datetime when form is loaded
const timestampField = document.getElementById('timestamp');
if (timestampField) {
  const now = new Date();
  timestampField.value = now.toISOString();
}

// MODAL LOGIC for membership cards
const modals = document.querySelectorAll('.modal');
const modalButtons = document.querySelectorAll('[data-modal-open]');

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) closeBtn.focus();
  }
}

function closeModal(modal) {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

// Add click handlers to modal trigger buttons
modalButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const modalId = btn.getAttribute('data-modal-open');
    if (modalId) openModal(modalId);
  });
});

// Allow clicking on the card itself to open modal
const cards = document.querySelectorAll('.membership-card');
cards.forEach(card => {
  const modalId = card.getAttribute('data-modal');
  if (modalId) {
    card.addEventListener('click', (e) => {
      if (e.target.classList && e.target.classList.contains('card-link')) return;
      openModal(modalId);
    });
  }
});

// Close modal with close button or clicking backdrop
modals.forEach(modal => {
  const closeBtn = modal.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
});

// Press Escape key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modals.forEach(modal => {
      if (modal.style.display === 'flex') closeModal(modal);
    });
  }
});

// Footer dynamic year and last modified
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.innerText = new Date().getFullYear();
}

const lastModifiedElement = document.getElementById('lastModified');
if (lastModifiedElement) {
  lastModifiedElement.innerHTML = `Last Updated: ${document.lastModified}`;
}

// Validation for organizational title (min 7 characters, letters/hyphens/spaces only)
const titleInput = document.getElementById('organizationTitle');
if (titleInput) {
  titleInput.addEventListener('input', function(e) {
    const pattern = /^[A-Za-z\-\s]{7,}$/;
    if (this.value && !pattern.test(this.value)) {
      this.setCustomValidity('Title must be at least 7 characters using only letters, hyphens or spaces.');
    } else {
      this.setCustomValidity('');
    }
  });
}

// Optional: Add phone input validation for better UX
const phoneField = document.getElementById('phone');
if (phoneField) {
  phoneField.addEventListener('input', () => {
    if (phoneField.value.trim() === '') {
      phoneField.setCustomValidity('');
    } else {
      phoneField.setCustomValidity('');
    }
  });
}