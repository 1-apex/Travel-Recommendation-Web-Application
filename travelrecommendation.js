let searchbtn = document.getElementById("searchbtn");
let clearbtn = document.getElementById("clearbtn");
let result = document.getElementById("resultContainer");
let mydiv = document.getElementById("dropdown");
let close = document.getElementById("close-btn");
let query = document.getElementById("searchinput");

// Book Now functionality
function bookNow() {
  alert("Thank you for your interest! Our booking system will redirect you to our travel partners. For now, please contact us through the Contact Us section to plan your dream destination!");
}

const clearsearch = () => {
  query.value = "";
  mydiv.style.display = "none";
  console.log("Clearing");
};

clearbtn.addEventListener("click", clearsearch);

const showResult = (name, img, info) => {
  if (mydiv.style.display === "none" || mydiv.style.display === "") {
    mydiv.style.display = "block";
  } else {
    mydiv.style.display = "none";
  }
  result.innerHTML = `
    <h2 class="title">${name}</h2>
    <img class="search-img" src=${img} alt="sofia">
    <p class="description">${info}</p>
  `;
};

const closeDropdown = () => {
  mydiv.style.display = "none";
  query.value = "";
};

close.addEventListener("click", closeDropdown);

const searchError = () => {
  if (mydiv.style.display === "none" || mydiv.style.display === "") {
    mydiv.style.display = "block";
  } else {
    mydiv.style.display = "none";
  }

  result.innerHTML = `<p class="notfound">Sorry we can't find your search</p>`;
};

fetch("travelrecommendation.json")
  .then((res) => res.json())
  .then((data) => {
    const search = () => {
      let searchQuery = query.value.toLowerCase().trim();
      let notfound = true;

      // Check if search query is empty
      if (searchQuery === "") {
        alert("Please enter a destination or keyword to search!");
        return;
      }

      // Search in countries/cities
      data.countries.forEach((country) => {
        country.cities.forEach((city) => {
          if (city.name.toLowerCase().includes(searchQuery) ||
              country.name.toLowerCase().includes(searchQuery)) {
            showResult(city.name, city.imageUrl, city.description);
            notfound = false;
          }
        });
      });

      // Search in temples
      data.temples.forEach((temple) => {
        if (temple.name.toLowerCase().includes(searchQuery) ||
            searchQuery.includes("temple")) {
          showResult(temple.name, temple.imageUrl, temple.description);
          notfound = false;
        }
      });

      // Search in beaches
      data.beaches.forEach((beach) => {
        if (beach.name.toLowerCase().includes(searchQuery) ||
            searchQuery.includes("beach")) {
          showResult(beach.name, beach.imageUrl, beach.description);
          notfound = false;
        }
      });

      if (notfound) {
        searchError();
      }
    };

    searchbtn.addEventListener("click", search);

    // Add Enter key support for search
    query.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        search();
      }
    });
  });
