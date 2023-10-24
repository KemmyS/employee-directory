
const employees = [];
const urlProfiles = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const overlay = document.querySelector(".overlay");
const flexContainer = document.querySelector(".flex-container");
const employeeCard = document.querySelector(".employee-card");
const employeeModalContent = document.querySelector(".modal-content");
const employeeModalClose = document.querySelector(".modal-close");
const sliderButton = document.querySelectorAll(".next-btn");
const leftButton = document.querySelector(".left");
const rightButton = document.querySelector(".right");
const search = document.getElementById("search");


const SHOW_CLASS = "show";
const HIDE_CLASS = "hide";
const FADE_IN_CLASS = "fade-in";
const FADE_OUT_CLASS = "fade-out";
const FADE_TIMER = 300;

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

  //Use fetch to retrieve information from the API
  fetch(urlProfiles)
.then(res => res.json())
.then(res => res.results)
.then(displayProfiles)
.catch(err => console.log(err))

/**
 * Stores the employee HTML as we create it
 * @param {object[]} employeeData the employee json from the API
 */
function displayProfiles(employeeData) {
    let employeeHTML = '';

    // loop through each employee and create HTML markup
    employeeData.forEach((employee, index) => {
        employees.push(employee);

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
    `
    });

flexContainer.innerHTML = employeeHTML;

}


function openModal(index) {
    const employee = employees[index];
    const {first, last} = employee.name;
    const {email, phone, picture} = employee;
    const {street, state, postcode} = employee.location;
    const city = employee.location.city;

    let date = new Date(employee.dob.date);
    employeeModalContent.setAttribute("data-index", index);

    const modalContent = `
    <img class="img" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${first} ${last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    <hr />
    <p>${phone}</p>
    <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
    <p>Birthday:
    ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    `;
    overlay.classList.remove("hide");
    employeeModalContent.innerHTML = modalContent;
    }

flexContainer.addEventListener('click', e => {
        const card = e.target;

        if (card.classList.contains("employee-card")) {
        const index = card.getAttribute('data-index');
        openModal(index);
        }

        });
    
  employeeModalClose.addEventListener('click', (e) => {
  overlay.classList.add("hide");
    });




    



