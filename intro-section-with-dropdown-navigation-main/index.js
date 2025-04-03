const navLinks = document.querySelectorAll(".nav__links li");
const toggleBtn = document.querySelector(".toggle_btn");
const mobileMenu = document.querySelector(".sidebar");
const overflow = document.querySelector(".overflow");
const mobileLinks = document.querySelectorAll(".mobile-links li");

// ==== TOGGLE OPEN & CLOSE SIDEBAR === //
toggleBtn.addEventListener("click", () => {
  const icon = document.querySelector(".toggle_btn img");
  toggleBtn.classList.toggle("active-btn");
  mobileMenu.classList.toggle("active-menu");
  overflow.classList.toggle("active-menu");
  if (toggleBtn.classList.contains("active-btn")) {
    icon.src = "/images/icon-close-menu.svg";
  } else icon.src = "/images/icon-menu.svg";
});

navLinks.forEach((link) => {
  const subMenu = link.querySelector(".sub-menu");
  link.addEventListener("click", () => {
    link.classList.toggle("active");
    subMenu.classList.toggle("active-menu");
  });
});

mobileLinks.forEach((link) => {
  const subMenu = link.querySelector(".mobile-sub");
  link.addEventListener("click", () => {
    link.classList.toggle("active");
    subMenu.classList.toggle("active-menu");
  });
});
