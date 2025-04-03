const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.querySelector(".close-btn");
const menu = document.querySelector(".nav__links");
const overlay = document.querySelector(".overlay");
const mainThumbnail = document.querySelector(".main-thumbnail");
const mainThumbnailLightBox = document.querySelector(
  ".lightbox-container .main-thumbnail"
);
const images = document.querySelectorAll(".preview img");
const plusBtn = document.querySelector("#plus");
const minusBtn = document.querySelector("#minus");
const amount = document.querySelector(".amount");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");
const slider = document.querySelector(".mobile-thumb");
const thumbMob = document.querySelector(".thumb-mob");
const cartBtn = document.querySelector(".cart__btn");
const cart = document.querySelector(".cart__wrap");
const closeLightboxBtn = document.querySelector(".close-lightbox");
const lightbox = document.querySelector(".lightbox");
const addBtn = document.querySelector(".add-btn");
const indicator = document.querySelector(".indicator");
const wrap = document.querySelector(".cart__content");
let amountValue = 0;
let currentImg = 1;

indicator.style.display = "none";

function openMenu() {
  menu.classList.add("active");
  overlay.classList.add("active");
}

function closeMenu() {
  menu.classList.remove("active");
  overlay.classList.remove("active");
}

function handlePlus() {
  amountValue++;
  amount.innerText = amountValue;
}

function handleMinus() {
  if (amountValue > 0) {
    amountValue--;
  }
  amount.innerText = amountValue;
}

function nextImage() {
  if (currentImg == 4) {
    currentImg = 1;
  } else {
    currentImg++;
  }
  thumbMob.src = `./images/image-product-${currentImg}.jpg`; // used backticks for template literal
}

function prevImage() {
  if (currentImg == 1) {
    currentImg = 4;
  } else {
    currentImg--;
  }
  thumbMob.src = `./images/image-product-${currentImg}.jpg`;
}

function toggleCart() {
  cart.classList.toggle("invisible");
}

function closeLightbox() {
  lightbox.classList.add("invisible");
  document.body.style.overflow = "auto";
}

function openLightBox() {
  lightbox.classList.remove("invisible");
  document.body.style.overflow = "hidden";
}

function addItem() {
  if (amountValue > 0) {
    const total = 125.0 * amountValue;
    wrap.classList.remove("empty");
    wrap.innerHTML = `<div class="product">
        <div>
          <img src="./images/image-product-1-thumbnail.jpg" class="product-img" alt="product">
          <div class="product-info">
            <p class="product-title">Fall Limited Edition Sneakers</p>
           <p><span>$125.00</span> × <span class="number">${amountValue}</span>      <b>$${total}</b></p>
          </div>
          <button class="delete-btn" onclick="deleteItem()"><img src="./images/icon-delete.svg" alt="delete"></button>
        </div>
        <button class="checkout-btn">Checkout</button>
      </div>`;

    indicator.style.display = "block";
    indicator.innerText = amountValue;
  }
}

function deleteItem() {
  wrap.classList.add("empty");
  wrap.innerHTML = `<p> Your cart is empty</p>`;
  indicator.style.display = "none";
}

images.forEach((image) => {
  image.addEventListener("click", () => {
    const lastImg = document.querySelectorAll(".selected");
    if (lastImg) {
      lastImg[0].classList.remove("selected"); //might need this for a future project
    }
    image.classList.add("selected");
    const selectedImg = document.querySelector(".selected");
    switch (selectedImg.getAttribute("src")) {
      case "./images/image-product-1-thumbnail.jpg":
        mainThumbnail.src = "./images/image-product-1.jpg";
        mainThumbnailLightBox.src = "./images/image-product-1.jpg";
        break;
      case "./images/image-product-2-thumbnail.jpg":
        mainThumbnail.src = "./images/image-product-2.jpg";
        mainThumbnailLightBox.src = "./images/image-product-2.jpg";
        break;
      case "./images/image-product-3-thumbnail.jpg":
        mainThumbnail.src = "./images/image-product-3.jpg";
        mainThumbnailLightBox.src = "./images/image-product-3.jpg";
        break;
      case "./images/image-product-4-thumbnail.jpg":
        mainThumbnail.src = "./images/image-product-4.jpg";
        mainThumbnailLightBox.src = "./images/image-product-4.jpg";
        break;
    }
  });
});

mainThumbnail.addEventListener("click", function () {
  window.scrollTo(0, 0);
});

menuBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);
plusBtn.addEventListener("click", handlePlus);
minusBtn.addEventListener("click", handleMinus);
nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", prevImage);
cartBtn.addEventListener("click", toggleCart);
closeLightboxBtn.addEventListener("click", closeLightbox);
mainThumbnail.addEventListener("click", openLightBox);
addBtn.addEventListener("click", addItem);
