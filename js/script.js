const employees = [];
const modalContent = [];

const urlProfiles = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;

const overlay = document.querySelector(".overlay");
const flexContainer = document.querySelector(".flex-container");

const employeeCard = document.querySelector(".employee-card");
const modalContainer = document.querySelector(".modal-container");
const employeeModalClose = document.querySelector(".modal-close");
const employeeModal = document.querySelector(".employee-modal");
const search = document.getElementById("search");

const SHOW_CLASS = "show";
const HIDE_CLASS = "hide";
const FADE_IN_CLASS = "fade-in";
const FADE_OUT_CLASS = "fade-out";
const FADE_TIMER = 300;

/**
 * Populates the page with employee data.
 * @param {any[]} employeeData the employee API data
 */
function init(employeeData) {
  employeeData.forEach((e => employees.push(e)));

  displayProfiles(employees);
  loadModal(employees);

  buildSlider();
}

window.addEventListener("load", () => {
  fetch(urlProfiles)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(init)
  .catch((err) => console.log(err));
});

//search input
search.addEventListener("keyup", (e) => {
  const currentValue = e.target.value.toLowerCase();
  const memberProfiles = document.querySelectorAll(".employee-card");

  memberProfiles.forEach((memberProfile) => {
    const memberName = memberProfile.querySelector(".name");
    if (memberName.textContent.toLowerCase().includes(currentValue)) {
      setTimeout(() => {
        memberProfile.classList.remove(HIDE_CLASS);
        memberProfile.classList.add(SHOW_CLASS);
      }, FADE_TIMER);

      memberProfile.classList.add(FADE_IN_CLASS);
      memberProfile.classList.remove(FADE_OUT_CLASS);
    } else {
      setTimeout(() => {
        memberProfile.classList.remove(SHOW_CLASS);
        memberProfile.classList.add(HIDE_CLASS);
      }, FADE_TIMER);

      memberProfile.classList.add(FADE_OUT_CLASS);
      memberProfile.classList.remove(FADE_IN_CLASS);
    }
  });
});

/**
 * Stores the employee HTML as we create it
 * @param {object[]} employeeData the employee json from the API
 */
function displayProfiles(employeeData) {
  let employeeHTML = "";

  // loop through each employee and create HTML markup
  employeeData.forEach((employee, index) => {
    const name = employee.name;
    const email = employee.email;
    const city = employee.location.city;
    const picture = employee.picture;

    // use template literals to create employee information
    employeeHTML += `
    <div class="employee-card" data-index="${index}">
      <img class="img" src="${picture.large}" />
      <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
      </div>
    </div>
    `;

    flexContainer.innerHTML = employeeHTML;
  });
}

/**
 * Creates a <p> element in the DOM
 * @param {string} className the CSS class of the element
 * @param {string} textContent the element's text content
 * @param {Element} container the element's parent
 */
function createParagraph(className, textContent, container) {
  const element = document.createElement("p");
  element.classList.add(className);
  element.textContent = textContent;
  container.append(element);
}

function loadModal(employeeData) {
  employeeData.forEach((employee, idx) => {
    const { first, last } = employee.name;
    const { email, phone, picture } = employee;
    const { street, state, postcode } = employee.location;
    const city = employee.location.city;
    const date = new Date(employee.dob.date);

    const modalContentDiv = document.createElement("div");
    modalContentDiv.classList.add("modal-content");
    modalContentDiv.setAttribute("data-index", idx);

    const img = document.createElement("img");
    img.classList.add("img")
    img.src = picture.large;
    img.alt = "Employee Image"
    modalContentDiv.append(img);

    const textDiv = document.createElement("div");
    textDiv.classList.add("text-container");

    const h2 = document.createElement("h2");
    h2.classList.add("name");
    h2.textContent = `${first} ${last}`;
    textDiv.append(h2);

    createParagraph("email", email, textDiv);
    createParagraph("address", city, textDiv);

    const hr = document.createElement("hr");
    textDiv.append(hr);

    createParagraph("phone", phone, textDiv);
    createParagraph("address", `${street.number} ${street.name}, ${state} ${postcode}`, textDiv);
    createParagraph("date", `Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`, textDiv);

    modalContentDiv.append(textDiv);
    modalContent.push(modalContentDiv);
    modalContainer.append(modalContentDiv);
  });

  //Deletes the "&nbsp;" text node
  modalContainer.childNodes[0].textContent = null;
}

function openModal(index) {
  //Show the appropriate modal as content
  const content = modalContent[index];
  goToSlide(+content.getAttribute("data-index"));

  //Show the overlay and modal
  overlay.classList.remove("hide");
}

flexContainer.addEventListener("click", (e) => {
  const card = e.target;

  if (card.classList.contains("employee-card")) {
    const index = +card.getAttribute("data-index");
    openModal(index);
  }
});

employeeModalClose.addEventListener("click", () => overlay.classList.add("hide"));

//SLIDER COMPONENT
const leftButton = document.querySelector(".modal-btn--left");
const rightButton = document.querySelector(".modal-btn--right");

function goToSlide(index) {
  modalContent.forEach((m, idx) => {
    m.style.transform = `translateX(${120 * (idx - index)}%)`;
  });
}

let currentSlide = 0;
let maxSlides = 0;

function buildSlider() {
  maxSlides = modalContent.length;
  goToSlide(0);
}

const next = () => {
  if (currentSlide === maxSlides - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
};

const previous = () => {
  if (currentSlide === 0) {
    currentSlide = maxSlides - 1;
  } else {
    currentSlide--;
  }

  goToSlide(currentSlide);
};

rightButton.addEventListener("click", next);
leftButton.addEventListener("click", previous);
