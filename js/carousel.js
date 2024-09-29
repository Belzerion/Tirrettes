async function loadJSON(file) 
{
  const response = await fetch(file);
  const data = await response.json();
  return data;
}

async function loadDataBase()
{
  const [adjective, noun, determinant, verb] = await Promise.all([
    loadJSON("https://belzerion.github.io/TirettesData/adj.json"),
    loadJSON("https://belzerion.github.io/TirettesData/noun.json"),
    loadJSON("https://belzerion.github.io/TirettesData/determinant.json"),
    loadJSON("https://belzerion.github.io/TirettesData/verb.json")
  ]);

  return {
    adjective,
    noun, 
    determinant, 
    verb
  };

}

function findAdjectifsByCriteria(database, gender, number) {
  return database.adjective.filter(adj => adj.gender === gender && adj.number === number);
}

function findNomsByCriteria(database, gender, number) {
  return database.noun.filter(nom => nom.gender === gender && nom.number === number);
}

function findDeterminantsByCriteria(database, gender, number) {
  return database.determinant.filter(det => det.gender === gender && det.number === number);
}

function getVerbes(database) {
  return database.verb.map(verb => verb.label);
}

const STRUCTURE_TO_ELEM = {
  dan: ["det", "adj", "noun"],
  dna: ["det", "noun", "adj"],
  dana: ["det", "adj1", "noun", "adj2"],
  dnv: ["det", "noun", "verb"],
  danav: ["det", "adj1", "noun", "adj2", "verb"],
  dnav: ["det", "noun", "adj", "verb"],
};

class Carousel {
  constructor(el, carouselData) {
    this.el = el;
    this.carouselOptions = ["previous", "play", "next"];
    this.carouselData = carouselData;
    this.carouselInView = Array.from(
      { length: carouselData.length },
      (_, i) => i + 1
    );
    this.carouselContainer;
    this.carouselPlayState;
  }

  getElId() {
    return this.el.id;
  }

  getCarouselDataSize() {
    return this.carouselData.length;
  }

  updateCarouselData(carouselData) {
    this.carouselData = carouselData;
    this.carouselData.forEach((item, index) => {
      const carouselItem = this.el.getElementsByClassName(
        `carousel-item carousel-item-${index + 1}`
      )[0];

      carouselItem.innerHTML = item.src;
      if ("gender" in item)
        carouselItem.setAttribute("data-gender", item.gender);
      if ("number" in item)
        carouselItem.setAttribute("data-number", item.number);
      if ("person" in item)
        carouselItem.setAttribute("data-person", item.person);
    });
  }

  mounted() {
    this.setupCarousel();
  }

  // Build carousel html
  setupCarousel() {
    const container = document.createElement("div");
    const controls = document.createElement("div");

    // Add container for carousel items and controls
    this.el.append(container, controls);
    container.className = "carousel-container";
    controls.className = "carousel-controls";

    // Take dataset array and append items to container
    this.carouselData.forEach((item, index) => {
      const carouselItem = document.createElement("div");

      container.append(carouselItem);

      // Add item attributes
      carouselItem.className = `carousel-item carousel-item-${index + 1}`;
      carouselItem.innerHTML = item.src;
      carouselItem.setAttribute("loading", "lazy");
      // Used to keep track of carousel items, infinite items possible in carousel however min 5 items required
      carouselItem.setAttribute("data-index", `${index + 1}`);

      if ("gender" in item)
        carouselItem.setAttribute("data-gender", item.gender);
      if ("number" in item)
        carouselItem.setAttribute("data-number", item.number);
      if ("person" in item)
        carouselItem.setAttribute("data-person", item.person);
    });

    this.carouselOptions.forEach((option) => {
      const btn = document.createElement("button");
      const axSpan = document.createElement("span");

      // Add accessibilty spans to button
      axSpan.innerText = option;
      axSpan.className = "ax-hidden";
      btn.append(axSpan);

      // Add button attributes
      btn.className = `carousel-control carousel-control-${option}`;
      btn.setAttribute("data-name", option);

      // Add carousel control options
      controls.append(btn);
    });

    // After rendering carousel to our DOM, setup carousel controls' event listeners
    this.setControls([...controls.children]);

    // Set container property
    this.carouselContainer = container;
  }

  setControls(controls) {
    controls.forEach((control) => {
      control.onclick = (event) => {
        event.preventDefault();

        // Manage control actions, update our carousel data first then with a callback update our DOM
        this.controlManager(control.dataset.name);
      };
    });
  }

  controlManager(control) {
    if (control === "previous") return this.previous();
    if (control === "next") return this.next();
    if (control === "add") return this.add();
    if (control === "play") return this.play();

    return;
  }

  previous() {
    // Update order of items in data array to be shown in carousel
    this.carouselData.unshift(this.carouselData.pop());

    // Push the first item to the end of the array so that the previous item is front and center
    this.carouselInView.push(this.carouselInView.shift());

    // Update the css class for each carousel item in view
    this.carouselInView.forEach((item, index) => {
      this.carouselContainer.children[
        index
      ].className = `carousel-item carousel-item-${item}`;
    });

    // Using the first 5 items in data array update content of carousel items in view
    this.carouselData.slice(0, 5).forEach((data, index) => {
      this.el.querySelector(`.carousel-item-${index + 1}`).src = data.src;
    });
  }

  next() {
    // Update order of items in data array to be shown in carousel
    this.carouselData.push(this.carouselData.shift());

    // Take the last item and add it to the beginning of the array so that the next item is front and center
    this.carouselInView.unshift(this.carouselInView.pop());

    // Update the css class for each carousel item in view
    this.carouselInView.forEach((item, index) => {
      this.carouselContainer.children[
        index
      ].className = `carousel-item carousel-item-${item}`;
    });

    // Using the first 5 items in data array update content of carousel items in view
    this.carouselData.slice(0, 5).forEach((data, index) => {
      this.el.querySelector(`.carousel-item-${index + 1}`).src = data.src;
    });
  }

  add() {
    const newItem = {
      id: "",
      src: "",
    };
    const lastItem = this.carouselData.length;
    const lastIndex = this.carouselData.findIndex(
      (item) => item.id == lastItem
    );

    // Assign properties for new carousel item
    Object.assign(newItem, {
      id: `${lastItem + 1}`,
      src: `http://fakeimg.pl/300/?text=${lastItem + 1}`,
    });

    // Then add it to the "last" item in our carouselData
    this.carouselData.splice(lastIndex + 1, 0, newItem);

    // Shift carousel to display new item
    this.next();
  }

  play() {
    const playBtn = this.el.querySelector(".carousel-control-play");
    const startPlaying = () => this.next();

    if (playBtn.classList.contains("playing")) {
      // Remove class to return to play button state/appearance
      playBtn.classList.remove("playing");

      // Remove setInterval
      clearInterval(this.carouselPlayState);
      this.carouselPlayState = null;
    } else {
      // Add class to change to pause button state/appearance
      playBtn.classList.add("playing");

      // First run initial next method
      this.next();

      // Use play state prop to store interval ID and run next method on a 1.5 second interval
      this.carouselPlayState = setInterval(startPlaying, 1500);
    }
  }
}

// // Set the date we're counting down to
// var countDownDate = new Date().getTime() + 30 * 60000;

// // Update the count down every 1 second
// var x = setInterval(function () {
//   // Get today's date and time
//   var now = new Date().getTime();

//   // Find the distance between now and the count down date
//   var distance = countDownDate - now;

//   // Time calculations for days, hours, minutes and seconds
//   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//   var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//   // Output the result in an element with id="demo"
//   document.getElementById("countdown").innerHTML =
//     days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

//   // If the count down is over, write some text
//   if (distance < 0) {
//     clearInterval(x);
//     document.getElementById("demo").innerHTML = "EXPIRED";
//   }
// }, 1000);

function getRndGender() {
  const rnd = Math.random();
  if (rnd < 0.5) return "Masculin";
  return "Féminin";
}

function getRndNumber() {
  const rnd = Math.random();
  if (rnd < 0.5) return "Singulier";
  return "Pluriel";
}

async function mountCarousel(collection, quantity, gender, number, id) {
  const carouselsDiv = document.getElementById("carousels");
  const carouselData = await generateSituation(
    collection,
    quantity,
    gender,
    number
  );
  carouselsDiv.insertAdjacentHTML(
    "beforeend",
    '<div class="carousel" id="' + id + '"></div>'
  );
  const carouselEl = document.getElementById(id);
  const carousel = new Carousel(carouselEl, carouselData);
  carousel.mounted();
  return carousel;
}

async function mountVerbCarousel(collection, quantity, person, id) {
  const carouselsDiv = document.getElementById("carousels");
  const carouselData = await getVerbCarouselData(collection, quantity, person);
  carouselsDiv.insertAdjacentHTML(
    "beforeend",
    '<div class="carousel" id="' + id + '"></div>'
  );
  const carouselEl = document.getElementById(id);
  const carousel = new Carousel(carouselEl, carouselData);
  carousel.mounted();
  return carousel;
}

async function updateCarousel(collection, quantity, gender, number, carousel) {
  const carouselData = await generateSituation(
    collection,
    quantity,
    gender,
    number
  );
  carousel.updateCarouselData(carouselData);
}

async function updateVerbCarousel(collection, quantity, person, carousel) {
  const carouselData = await getVerbCarouselData(collection, quantity, person);
  carousel.updateCarouselData(carouselData);
}

async function updateCarousels(db, carousels) {
  const gender = getRndGender();
  const number = getRndNumber();
  const person = number == "Pluriel" ? "P6" : "P3";
  for (const carousel of carousels) {
    const quantity = carousel.getCarouselDataSize();
    const carouselId = carousel.getElId();
    if (carouselId == "det") {
      const { determinant } = db;
      await updateCarousel(determinant, quantity, gender, number, carousel);
    } else if (carouselId == "noun") {
      const { noun } = db;
      await updateCarousel(noun, quantity, gender, number, carousel);
    } else if (
      carouselId == "adj" ||
      carouselId == "adj1" ||
      carouselId == "adj2"
    ) {
      const { adjective } = db;
      await updateCarousel(adjective, quantity, gender, number, carousel);
    } else if (carouselId == "verb") {
      const { verb } = db;
      await updateVerbCarousel(verb, quantity, person, carousel);
    }
  }
}

async function mountCarousels(db, elems, url) {
  const { determinant } = db;
  const carousels = [];
  const gender = getRndGender();
  const number = getRndNumber();
  const person = number == "Pluriel" ? "P6" : "P3";
  for (const elem of elems) {
    const quantity = parseInt(url.searchParams.get(elem));
    if (elem == "det") {
      const { determinant } = db;
      const detCar = await mountCarousel(
        determinant,
        quantity,
        gender,
        number,
        elem
      );
      carousels.push(detCar);
    } else if (elem == "noun") {
      const { noun } = db;
      const nounCar = await mountCarousel(noun, quantity, gender, number, elem);
      carousels.push(nounCar);
    } else if (elem == "adj" || elem == "adj1" || elem == "adj2") {
      const { adjective } = db;
      const adjCar = await mountCarousel(
        adjective,
        quantity,
        gender,
        number,
        elem
      );
      carousels.push(adjCar);
    } else if (elem == "verb") {
      const { verb } = db;
      const verbCar = await mountVerbCarousel(verb, quantity, person, elem);
      carousels.push(verbCar);
    }
  }
  return carousels;
}

async function getCarouselData(collection, gender, number, quantity) {

  const collDict = [];
  collection["docs"].map((item) =>
    collDict.push({
      label: item.label,
      gender: item.gender,
      number: item.number,
    })
  );
  const filteredItems = collDict.filter(
    (item) =>
      (item.gender == gender && item.number == number) ||
      (item.gender != gender &&
        (gender == "Masculin/Féminin" || item.gender == "Masculin/Féminin") &&
        item.number == number) ||
      (item.number != number &&
        (number == "Singulier/Pluriel" || item.number == "Singulier/Pluriel") &&
        item.gender == gender) ||
      (item.number != number &&
        (number == "Singulier/Pluriel" || item.number == "Singulier/Pluriel") &&
        item.gender != gender &&
        (gender == "Masculin/Féminin" || item.gender == "Masculin/Féminin"))
  );
  const item = filteredItems[Math.floor(Math.random() * filteredItems.length)];
  collDict.splice(collDict.indexOf(item), 1);
  const carouselData = [
    { id: "1", src: item.label, gender: item.gender, number: item.number },
  ];
  for (let i = 2; i < quantity + 1; ++i) {
    const item = collDict[Math.floor(Math.random() * collDict.length)];
    carouselData.push({
      id: `${i}`,
      src: item.label,
      gender: item.gender,
      number: item.number,
    });
    collDict.splice(collDict.indexOf(item), 1);
  }
  return carouselData;
}

async function getVerbCarouselData(collection, quantity, person) {
  const collDict = [];
  collection["docs"].map((item) =>
    collDict.push({
      label: item.label,
      person: item.person,
    })
  );
  const filteredItems = collDict.filter(
    (item) => item.person == person || (person == "P3" && item.person == "P1P3")
  );
  const item = filteredItems[Math.floor(Math.random() * filteredItems.length)];
  collDict.splice(collDict.indexOf(item), 1);
  const carouselData = [{ id: "1", src: item.label, person: item.person }];
  for (let i = 2; i < quantity + 1; ++i) {
    const item = collDict[Math.floor(Math.random() * collDict.length)];
    carouselData.push({
      id: `${i}`,
      src: item.label,
      person: item.person,
    });
    collDict.splice(collDict.indexOf(item), 1);
  }
  return carouselData;
}

function rotateElement(el) {
  const wiggletime = 150;
  el.classList.add("rotateable");
  el.style.transform = "translateX(-50%) rotate(100deg)";

  setTimeout(function () {
    el.style.transform = el.style.transform.replace(
      "rotate(100deg)",
      "rotate(-100deg)"
    );
    setTimeout(function () {
      el.style.transform = el.style.transform.replace(
        "rotate(-100deg)",
        "rotate(0deg)"
      );
    }, wiggletime);
  }, wiggletime);

  return true;
}

function flashElement(elems) {
  for (let elem of elems) {
    elem.style.background = "#2ECC40";
  }
  var id = setInterval(CorrectAnimation, 500);
  function CorrectAnimation() {
    for (let elem of elems) {
      elem.style.background = "#ddd";
    }
    clearInterval(id);
  }
}

async function generateSituation(collection, quantity, gender, number) {
  const data = await getCarouselData(collection, gender, number, quantity);
  return data;
}

async function run() {
  const url = new URL(document.location.href);
  const mode = url.searchParams.get("mode");
  const structure = url.searchParams.get("structure");
  const elems = STRUCTURE_TO_ELEM[structure];
  const db = await loadDataBase();
  const carousels = await mountCarousels(db, elems, url);
  window.Validate = async function () {
    const elems = document.getElementsByClassName("carousel-item-3");
    const nounEl = document.getElementById("noun");
    const gender = nounEl
      .getElementsByClassName("carousel-item-3")[0]
      .getAttribute("data-gender");
    const number = nounEl
      .getElementsByClassName("carousel-item-3")[0]
      .getAttribute("data-number");
    let errorGender = false;
    let errorNumber = false;
    let errorPerson = false;

    for (let elem of elems) {
      if (
        elem.getAttribute("data-gender") != null &&
        elem.getAttribute("data-gender") != gender &&
        gender != "Masculin/Féminin" &&
        elem.getAttribute("data-gender") != "Masculin/Féminin"
      ) {
        errorGender = true;
        break;
      }
      if (
        elem.getAttribute("data-number") != null &&
        elem.getAttribute("data-number") != number &&
        number != "Singulier/Pluriel" &&
        elem.getAttribute("data-number") != "Singulier/Pluriel"
      ) {
        errorNumber = true;
        break;
      }
      if (
        elem.getAttribute("data-person") != null &&
        number != "Singulier/Pluriel" &&
        ((!elem.getAttribute("data-person").includes("P3") &&
          number.includes("Singulier")) ||
          (!elem.getAttribute("data-person").includes("P6") &&
            number.includes("Pluriel")))
      ) {
        errorPerson = true;
        break;
      }
    }
    if (errorGender || errorNumber || errorPerson) {
      for (let elem of elems) {
        rotateElement(elem);
      }
    } else {
      flashElement(elems);
      if (mode == "modeTwo") {
        updateCarousels(db, carousels);
      }
    }
  };
}



run();
