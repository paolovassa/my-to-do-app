const capitalizeStr = (str) => str[0].toUpperCase() + str.slice(1);

/*Controlla se ci sono elementi nel <div> con id "todo-grid": se ci sono mostra il campo di
ricerca, se non ci sono lo nasconde. Deve essere eseguita: quando carica la pagina, dopo la
funzione che mostra gli impegni memorizzati; quando si aggiunge un nuovo impegno; quando si
rimuove un impegno dalla griglia. */
function checkGridUI() {
  if (todoGrid.children.length > 0) {
    searchSection.classList.remove("d-none");
  } else {
    searchSection.classList.add("d-none");
  }
}

const generateEmptyGridMsg = () => {
  const messageCol = document.createElement("div");
  messageCol.classList.add("col", "empty-grid-message");

  const message = document.createElement("p");
  message.appendChild(document.createTextNode("Nessun risultato trovato"));

  messageCol.appendChild(message);

  return messageCol;
};

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
const resetInputSection = () => {
  markAsInvalid(descriptionInput);
  markAsInvalid(priorityInput);

  addBtn.setAttribute("disabled", "");
};

/*Controlla se nel pulsante con id "add-btn" c'è lo spinner: se non c'è lo aggiunge, 
altrimenti lo rimuove. */
const toggleSpinner = () => {
  if (addBtn.querySelector(".spinner-border")) {
    addBtn.innerHTML = `<i class="bi bi-plus-circle me-1"></i> Aggiungi`;
  } else {
    addBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                        <span role="status">Aggiungo...</span>`;
  }
};

/*Prende in input una stringa che contiene la descrizione di un'attività e un numero intero 
che rappresenta la sua priorità. Crea e restituisce un elemento con classe "col" che contiene 
la card che rappresenta l'impegno i cui dati sono stati forniti in input. */
function generateTodoCard(description, priority, id) {
  const todoColumn = document.createElement("div");
  todoColumn.classList.add("col");

  todoColumn.innerHTML = `            
  <div class="card todo-card bg-light border-0 rounded-2">
    <div class="interaction-icons d-flex gap-2">
      <i class="bi bi-pencil-square"></i>
      <i class="bi bi-x-lg"></i>
    </div>
    <div class="card-body p-4 pt-5">
      <p class="card-text todo-description p-2">
        ${description}
      </p>
    </div>
  </div>`;

  todoColumn.querySelector(".todo-card").setAttribute("data-id", id);

  todoColumn
    .querySelector(".card-body")
    .appendChild(generatePriorityIcons(priority, "bi bi-alarm-fill"));

  return todoColumn;
}

/* Dato un livello di priorità e una stringa contenente classi CSS separate da spazio,
restituisce un elemento che contiene tre icone; un numero di esse pari al livello di priorità 
fornito ha colore normale, le altre sono quasi trasparenti.*/
function generatePriorityIcons(priority, iconClasses) {
  const priorityDiv = document.createElement("div");
  priorityDiv.className = "priority-level d-flex justify-content-center gap-2";

  let iconElement;

  for (let i = 0; i < Object.keys(priorityLevels).length; i++) {
    iconElement = document.createElement("i");
    iconElement.className = iconClasses;

    if (i >= priority) iconElement.classList.add("opacity-25");
    priorityDiv.appendChild(iconElement);
  }

  return priorityDiv;
}

const generateOption = (optionText, optionValue) => {
  const option = document.createElement("option");
  option.setAttribute("value", optionValue);
  option.appendChild(document.createTextNode(optionText));

  return option;
};

/*Aggiorna il local storage associando alla chiave "todosDB" lo stato attuale della
struttura dati JS, sotto forma di stringa JSON. */
function updateLocalStorage() {
  localStorage.setItem("todosDB", JSON.stringify(todosDB));
  localStorage.setItem("lastUsedID", JSON.stringify(lastUsedID));
}

function populateSelect(select, options) {
  //Itera su ciascuna chiave dell'oggetto passato in input
  for (const option in options) {
    select.appendChild(generateOption(options[option], option));
  }
}

function displayStoredActivities() {
  const todosFragment = document.createDocumentFragment();

  todosDB.forEach((todoObj) => {
    todosFragment.append(
      generateTodoCard(todoObj.description, todoObj.priority, todoObj.id)
    );
  });

  todoGrid.appendChild(todosFragment);
}

/*Funzione eseguita ogni volta che l'utente modifica il valore di uno dei campi della
sezione di input. Per prima cosa resetta lo stato della sezione di input, poi controlla se
ciascun campo contiene un valore valido e nel caso rende verde il testo sottostante. Se i
valori di entrambi i campi sono validi rende cliccabile il pulsante di inserimento. */
function checkValidInputs(e) {
  //Resetta lo stato della sezione di input
  resetInputSection();

  //Assegno l'elemento su cui è stato registrato l'evento alla variabile
  const targetElement = e.target;

  let descriptionInput, priorityInput;

  switch (targetElement.id) {
    case "descriptionInput":
      descriptionInput = targetElement;
      priorityInput = document.querySelector("#priorityInput");
      break;
    case "priorityInput":
      descriptionInput = document.querySelector("#descriptionInput");
      priorityInput = targetElement;
      break;
  }

  let validDescription = false;
  let validPriority = false;

  if (descriptionInput.value.trim().length >= minDescriptionLength)
    markAsValid(descriptionInput), (validDescription = true);

  if (priorityInput.value !== "")
    markAsValid(priorityInput), (validPriority = true);

  if (validDescription && validPriority) addBtn.removeAttribute("disabled");
}

/*Itera su ciascuna colonna della griglia e controlla se la descrizione della card 
corrispondente contiene la stringa attualmente inserita nel campo di ricerca: se non la 
contiene nasconde la colonna. */
function searchCriterionMatch() {
  const searchStr = searchInput.value.trim().toLowerCase();
  const emptyGridMsg = todoGrid.querySelector(".empty-grid-message");

  if (emptyGridMsg) emptyGridMsg.remove();

  let noMatch = true;
  const gridColumns = todoGrid.querySelectorAll(".col");

  gridColumns.forEach((col) => {
    const cardText = col
      .querySelector(".card-text")
      .textContent.trim()
      .toLowerCase();

    if (cardText.includes(searchStr)) {
      col.classList.remove("d-none");
      noMatch = false;
    } else {
      col.classList.add("d-none");
    }
  });

  if (noMatch) todoGrid.appendChild(generateEmptyGridMsg());
}

function addNewTodo(description, priority, todoID) {
  //Oggetto JS che rappresenta il nuovo todo, viene poi aggiunto nella struttura dati
  const newTodoObject = {
    id: todoID,
    description: description,
    priority: priority,
  };

  /*Qui inseriremo l'oggetto creato nella struttura dati, magari
  effettuando prima qualche controllo nella struttura (duplicati ecc.) */
  todosDB.push(newTodoObject);

  const newTodoCard = generateTodoCard(description, priority, todoID);

  todoGrid.appendChild(newTodoCard);
  toggleSpinner();
  checkGridUI();
}

function removeTodo(activityToDelete) {
  if (
    confirm(
      `Sei sicur* di voler eliminare l'evento "${
        activityToDelete.querySelector(".todo-description").innerText
      }"?`
    )
  ) {
    const activityID = +activityToDelete
      .querySelector(".todo-card")
      .getAttribute("data-id");

    //Eliminazione dell'elemento dal DOM
    activityToDelete.remove();

    //Eliminazione logica, dalla struttura dati e dal local storage
    todosDB.splice(
      todosDB.findIndex((todo) => todo.id === activityID),
      1
    );

    checkGridUI();
  }
}

function editTodo(activityToEdit) {
  const activityCard = activityToEdit.querySelector(".todo-card");
  activityCard.style.opacity = "0.85";

  //ID dell'attività che sto modificando
  editingActivityID = +activityCard.getAttribute("data-id");
  console.log(editingActivityID);

  activityObj = todosDB.find((activity) => activity.id === editingActivityID);

  descriptionInput.value = activityObj.description;
  prioritySelect.value = activityObj.priority;
  markAsValid(descriptionInput);
  markAsValid(prioritySelect);
  addBtn.removeAttribute("disabled");

  addBtn.innerHTML = `<i class="bi bi-pencil-square me-1"></i> Modifica`;
}

const gridInteraction = (e) => {
  const eventTarget = e.target;

  if (eventTarget.matches(".todo-card .bi-x-lg")) {
    removeTodo(eventTarget.closest(".col"));
  } else if (eventTarget.matches(".todo-card .bi-pencil-square")) {
    editTodo(eventTarget.closest(".col"));
  }

  updateLocalStorage();
};

const priorityLevels = {
  3: {
    valore: "alta",
    label: "Alta",
  },
  2: {
    valore: "media",
    label: "Media",
  },
  1: {
    valore: "bassa",
    label: "Bassa",
  },
};

var minDescriptionLength = 15;
var todosDB = JSON.parse(localStorage.getItem("todosDB")) || [];
var lastUsedID = +JSON.parse(localStorage.getItem("lastUsedID")) || 0;

/*Viene aggiornata con l'id di un'attività quando si preme il pulsante di modifica della
rispettiva card. Serve per decidere se, quando si preme il pulsante del form, è necessario o
meno eliminare la vecchia versione dell'attività prima di aggiungere la nuova. */
var editingActivityID = 0;

var prioritySelect = document.getElementById("priorityInput");
var descriptionInput = document.getElementById("descriptionInput");
var searchInput = document.getElementById("searchInput");

var addBtn = document.getElementById("add-btn");
var inputSection = document.getElementById("input-section");
var todoGrid = document.getElementById("todo-grid");
var inputForm = document.getElementById("input-form");
var searchSection = document.getElementById("search-section");

//Event Listeners
window.addEventListener("DOMContentLoaded", () => {
  descriptionInput.nextElementSibling.innerHTML = `<i class="bi bi-check2-circle"></i> Deve contenere almeno ${minDescriptionLength} caratteri.`;

  const priorities = {};

  for (const priority in priorityLevels) {
    priorities[priority] = priorityLevels[priority].label;
  }

  populateSelect(prioritySelect, priorities);
  displayStoredActivities();
  checkGridUI();
});

inputSection.addEventListener("input", checkValidInputs);

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addBtn.setAttribute("disabled", "");

  const inputDescription = descriptionInput.value.trim();
  const inputPriority = prioritySelect.value;

  let IDToUse;

  if (editingActivityID > 0) {
    IDToUse = editingActivityID;

    const updatedActivityDOM = generateTodoCard(
      inputDescription,
      inputPriority,
      IDToUse
    );
    const updatedActivityObj = {
      id: IDToUse,
      description: inputDescription,
      priority: inputPriority,
    };

    todosDB[todosDB.findIndex((activity) => activity.id === IDToUse)] =
      updatedActivityObj;

    const currentActivityVersionDOM = todoGrid.querySelector(
      `[data-id = "${IDToUse}"]`
    ).parentElement;
    currentActivityVersionDOM.insertAdjacentElement(
      "beforebegin",
      updatedActivityDOM
    );
    currentActivityVersionDOM.remove();

    addBtn.innerHTML = `<i class="bi bi-plus-circle me-1"></i> Aggiungi`;
    editingActivityID = 0;
    searchCriterionMatch();
    updateLocalStorage();
  } else {
    toggleSpinner();
    lastUsedID = lastUsedID + 1;
    setTimeout(() => {
      IDToUse = lastUsedID;
      addNewTodo(inputDescription, inputPriority, IDToUse);
      searchCriterionMatch();
      updateLocalStorage();
    }, 400);
  }

  descriptionInput.value = "";
  prioritySelect.value = "";
  resetInputSection();
});

todoGrid.addEventListener("click", gridInteraction);

searchInput.addEventListener("input", searchCriterionMatch);
