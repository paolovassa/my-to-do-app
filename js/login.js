/*Aggiunge la classe "valid-input" all'elemento che è il fratello immediatamente successivo
al controllo fornito come argomento alla funzione. */
function markAsValid(inputField) {
  inputField.nextElementSibling.classList.add("valid-input");
}

/*Rimuove la classe "valid-input" all'elemento che è il fratello immediatamente successivo
al controllo fornito come argomento alla funzione. */
function markAsInvalid(inputField) {
  inputField.nextElementSibling.classList.remove("valid-input");
}

/*Eseguita ogni volta che l'utente inserisce un input in uno dei campi. Resetta la sezione
di input rimuovendo la classe "valid-input" da entrambi i controlli e disabilitando il 
pulsante di inserimento.*/
const resetLoginSection = (formControls) => {
  formControls.forEach((control) => {
    markAsInvalid(control);
  });

  loginBtn.setAttribute("disabled", "");
};

function checkValidLogin() {
  const formControls = this.querySelectorAll(".form-control");

  resetLoginSection(formControls);

  let allValid = true;

  formControls.forEach((control) => {
    if (control.value.trim() === "") {
      allValid = false;
    } else {
      markAsValid(control);
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

//Event Listeners
window.addEventListener("DOMContentLoaded", showSelectedPanel);
loginForm.addEventListener("input", checkValidLogin);
