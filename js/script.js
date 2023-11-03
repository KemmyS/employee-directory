const employees = [];
const slides = [];

const employeeApiUrl = `https://randomuser.me/api/?results=12&inc=name,picture,
email,location,phone,dob&noinfo&nat=US`;

const overlay = document.querySelector(".overlay");
const flexContainer = document.querySelector(".flex-container");

const employeeCard = document.querySelector(".employee-card");
const slider = document.querySelector(".slider");
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

/**
 * Fetch the API data when the page loads.
 */
window.addEventListener("load", () => {
  fetch(employeeApiUrl)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(init)
  .catch((err) => console.log(err));
});

/**
 * The Search Input functionality
 */
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
 * Transforms employee API data into HTML
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

/**
 * Inserts employee data into the modal when the page loads.
 * @param {object[]} employeeData 
 */
function loadModal(employeeData) {
  employeeData.forEach((employee, idx) => {
    const { first, last } = employee.name;
    const { email, phone, picture } = employee;
    const { street, state, postcode } = employee.location;
    const city = employee.location.city;
    const date = new Date(employee.dob.date);

    const slide = document.createElement("div");
    slide.classList.add("slide");
    slide.setAttribute("data-index", idx);

    const img = document.createElement("img");
    img.classList.add("img")
    img.src = picture.large;
    img.alt = "Employee Image"
    slide.append(img);

    const textContainer = document.createElement("div");
    textContainer.classList.add("text-container");

    const topTextDiv = document.createElement("div");
    topTextDiv.classList.add("text-upper");

    const h2 = document.createElement("h2");
    h2.classList.add("name");
    h2.textContent = `${first} ${last}`;
    topTextDiv.append(h2);

    createParagraph("email", email, topTextDiv);
    createParagraph("address", city, topTextDiv);

    const hr = document.createElement("hr");
    topTextDiv.append(hr);

    const lowerTextDiv = document.createElement("div");
    lowerTextDiv.classList.add("text-lower");

    createParagraph("phone", phone, lowerTextDiv);

    createParagraph("address", 
    `${street.number} ${street.name}, ${state} ${postcode}`
    , lowerTextDiv);

    createParagraph("date",
     `Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`, 
     lowerTextDiv);

     textContainer.append(topTextDiv);
     textContainer.append(lowerTextDiv);

    slide.append(textContainer);
    slides.push(slide);
    slider.append(slide);
  });

  //Deletes the "&nbsp;" text node
  slider.childNodes[0].textContent = null;
}

/**
 * Opens the modal with the specified employee's data.
 * @param {number} index the employee's location in the array
 */
function openModal(index) {
  //Show the appropriate modal as content
  const slide = slides[index];
  goToSlide(+slide.getAttribute("data-index"));

  //Show the overlay and modal
  overlay.classList.remove("hide");
}

/**
 * Adds a click event to the employee's card.
 */
flexContainer.addEventListener("click", (e) => {
  const card = e.target;
  

  if (card.classList.contains("employee-card")) {
    const index = +card.getAttribute("data-index");
    openModal(index);
  }

  if (card.classList.contains("img")) {
    const index = +card.getAttribute("data-index");
    openModal(index);

  }else{
    card.classList.contains("text-container")
      const index = +card.getAttribute("data-index");
      openModal(index);
    
  }
});
/**
 * Click even to close the modal
 */
employeeModalClose.addEventListener("click", () => overlay.classList.add("hide"));

//SLIDER COMPONENT
const leftButton = document.querySelector(".slider-btn--left");
const rightButton = document.querySelector(".slider-btn--right");

/**
 * Moves the slide with an animation.
 * @param {number} index the location of the slide in the array.
 */
function goToSlide(index) {
  slides.forEach((slide, idx) => {
    slide.style.transform = `translateX(${120 * (idx - index)}%)`;
  });
}

let currentSlide = 0;
let maxSlides = 0;

/**
 * Initialize the slider's functionality when the page loads.
 */
function buildSlider() {
  maxSlides = slides.length;
  goToSlide(0);
}

/**
 * Move to the next slide.
 */
const next = () => {
  if (currentSlide === maxSlides - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
};

/**
 * Return to the previous slide.
 */
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
