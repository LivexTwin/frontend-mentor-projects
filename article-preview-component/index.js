const shareBtn = document.getElementById("share-btn");
const banner = document.querySelector(".banner");

shareBtn.addEventListener("click", (e) => {
  const isOpen = banner.classList.toggle("active");

  setTimeout(() => shareBtn.classList.toggle("active"), 10);

  if (isOpen) {
    banner.style.opacity = "1";
    setTimeout(() => banner.setAttribute("aria-hidden", "false"), 10);
  } else {
    banner.setAttribute("aria-hidden", "true");
    setTimeout(() => (banner.style.opacity = "0"));
  }
});

// Close the banner when clicking outside
document.addEventListener("click", (e) => {
  const isClickInside =
    shareBtn.contains(e.target) || banner.contains(e.target);

  if (!isClickInside && banner.classList.contains("active")) {
    banner.classList.remove("active");
    shareBtn.classList.remove("active");
    banner.setAttribute("aria-hidden", "true");
  }
  console.log("banner closed :) ✪✪");
});
