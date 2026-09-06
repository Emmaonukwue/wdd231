const toggle = document.querySelector("#menu-toggle");
const nav = document.querySelector("#nav-menu");

toggle.addEventListener("click", () => {
  nav.style.display = nav.style.display === "block" ? "none" : "block";
});
