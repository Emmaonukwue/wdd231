// Footer year and last modified
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent =
  "Last Modified: " + document.lastModified;

// Fetch members and display
async function loadMembers() {
  try {
    const response = await fetch("data/members.json");
    const members = await response.json();

    const container = document.getElementById("membersContainer");
    container.innerHTML = "";

    members.forEach(member => {
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
          <span class="badge ${member.level}">${member.level}</span>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading members:", err);
  }
}
loadMembers();

// Toggle grid / list view
const gridBtn = document.getElementById("gridBtn");
const listBtn = document.getElementById("listBtn");
const directory = document.getElementById("membersContainer");

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
