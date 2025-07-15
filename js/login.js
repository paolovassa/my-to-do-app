/*Data una stringa restituisce "true" se contiene almeno un numero, "false" altrimenti. */
const includesNumber = (str) => {
  for (let i = 0; i < str.length; i++) {
    if (!isNaN(str[i])) return true;
  }

  return false;
};

/* Dato un campo input di tipo password restituisce "true" se il valore contenuto nel campo
al momento della chiamata soddisfa tutti i vincoli impostati. */
function checkValidPassword() {
  let validPassword = true;
  const currentPasswordValue = registerPasswordInput.value;

  const lengthConstraintText = document.querySelector(
    "#length-password-constraint"
  );
  const digitConstraintText = document.querySelector(
    "#digit-password-constraint"
  );

  if (currentPasswordValue.length >= 8) {
    lengthConstraintText.classList.add("valid-input");
  } else {
    lengthConstraintText.classList.remove("valid-input");
    validPassword = false;
  }

  if (includesNumber(currentPasswordValue)) {
    digitConstraintText.classList.add("valid-input");
  } else {
    digitConstraintText.classList.remove("valid-input");
    validPassword = false;
  }

  return validPassword;
}

function checkValidLogin() {
  loginBtn.setAttribute("disabled", "");
  const formControls = this.querySelectorAll(".form-control");

  let allValid = true;

  formControls.forEach((control) => {
    const IDslices = control.getAttribute("id").split("-");
    const textID = [
      ...IDslices.slice(0, IDslices.length - 1),
      "constraint",
    ].join("-");
    const controlText = document.querySelector(`#${textID}`);

    if (control.value.trim() === "") {
      controlText.classList.remove("valid-input");
      allValid = false;
    } else {
      controlText.classList.add("valid-input");
    }
  });

  if (allValid) loginBtn.removeAttribute("disabled");
}

function checkValidRegistration() {
  registerBtn.setAttribute("disabled", "");
  let allValid = true;

  //Controlliamo che il campo "Username" contenga almeno 6 caratteri
  let IDslices = registerUsernameInput.getAttribute("id").split("-");
  let textID = [...IDslices.slice(0, IDslices.length - 1), "constraint"].join(
    "-"
  );
  let controlText = document.querySelector(`#${textID}`);

  if (registerUsernameInput.value.trim().length >= 6) {
    controlText.classList.add("valid-input");
  } else {
    controlText.classList.remove("valid-input");
    allValid = false;
  }

  //Controlliamo che il campo "Email" contenga un indirizzo valido
  IDslices = registerEmailInput.getAttribute("id").split("-");
  textID = [...IDslices.slice(0, IDslices.length - 1), "constraint"].join("-");
  controlText = document.querySelector(`#${textID}`);

  if (/[^@]+@[^@]+\.[a-z]+/.test(registerEmailInput.value.trim())) {
    controlText.classList.add("valid-input");
  } else {
    controlText.classList.remove("valid-input");
    allValid = false;
  }

  //Controlliamo che il valore del campo password soddisfi tutti i criteri
  if (
    checkValidPassword() &&
    registerPasswordInput.value === confirmPasswordInput.value
  ) {
    document
      .querySelector("#correspondence-register-password")
      .classList.add("valid-input");
  } else {
    allValid = false;
    document
      .querySelector("#correspondence-register-password")
      .classList.remove("valid-input");
  }

  if (allValid) registerBtn.removeAttribute("disabled");
}

/*Eseguita al caricamento della pagina. Recupera il valore associato alla chiave 
"redirectToPanel" nel localStorage e assegna le classi "show" e "active" al pannello che ha 
come ID il valore recuperato.*/
function showSelectedPanel() {
  const targetPanelID =
    JSON.parse(localStorage.getItem("redirectToPanel")) || "pills-login";

  const targetPanel = pillsTabContent.querySelector(`#${targetPanelID}`);
  const targetPanelBtn = document.querySelector(
    `#pills-tab button[data-bs-target='#${targetPanelID}']`
  );

  targetPanel.classList.add("show", "active");
  targetPanelBtn.classList.add("active");

  localStorage.removeItem("redirectToPanel");
}

var pillsTabContent = document.getElementById("pills-tabContent");

//Elementi del form di accesso
var loginBtn = document.getElementById("login-btn");
var loginForm = document.getElementById("login-form");

//Elementi del form di registrazione
var registerForm = document.getElementById("register-form");
var registerUsernameInput = document.getElementById("register-username-input");
var registerEmailInput = document.getElementById("register-email-input");
var registerPasswordInput = document.getElementById("register-password-input");
var confirmPasswordInput = document.getElementById("confirm-register-password");
var registerBtn = document.getElementById("register-btn");

//Event Listeners
window.addEventListener("DOMContentLoaded", showSelectedPanel);
loginForm.addEventListener("input", checkValidLogin);
registerForm.addEventListener("input", checkValidRegistration);
