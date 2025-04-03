const submit = document.querySelector(".submit");
const error = document.querySelector(".error");
const form = document.querySelector(".container form");
const email = document.querySelector(".container form input[type=email]");
const label = document.querySelector("label");

form.addEventListener("submit", validate);
submit.addEventListener("click", validate);

function validate(e) {
  e.preventDefault();
  let emailValue = email.value;
  if (validateEmail(emailValue)) {
    form.classList.remove("error");
  } else {
    form.classList.add("error");
  }
}

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
