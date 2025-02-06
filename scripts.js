// scripts.js
const menuIcon = document.getElementById("menu-icon");
const dropdown = document.querySelector(".dropdown");

menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("active");
    dropdown.classList.toggle("active");
});
