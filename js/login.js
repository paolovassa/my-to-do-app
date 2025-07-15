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

  console.log(validPassword);
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

/* */

var pillsTabContent = document.getElementById("pills-tabContent");
var loginBtn = document.getElementById("login-btn");
var loginForm = document.getElementById("login-form");
var registerForm = document.getElementById("register-form");
var registerPasswordInput = document.getElementById("register-password-input");

//Event Listeners
window.addEventListener("DOMContentLoaded", showSelectedPanel);
loginForm.addEventListener("input", checkValidLogin);
registerForm.addEventListener("input", checkValidPassword);
