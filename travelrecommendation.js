// DOM Elements
let searchbtn = document.getElementById("searchbtn");
let clearbtn = document.getElementById("clearbtn");
let result = document.getElementById("resultContainer");
let searchOverlay = document.getElementById("search-overlay");
let searchToggleBtn = document.getElementById("search-toggle-btn");
let closeSearchBtn = document.getElementById("close-search");
let query = document.getElementById("searchinput");
let searchResults = document.getElementById("search-results");

// Navigation search elements
let navSearchBtn = document.getElementById("nav-searchbtn");
let navClearBtn = document.getElementById("nav-clearbtn");
let navQuery = document.getElementById("nav-searchinput");

// Search Overlay Functions
function openSearchOverlay() {
  searchOverlay.style.display = 'flex';
  setTimeout(() => {
    searchOverlay.classList.add('active');
    query.focus();
  }, 10);
}

function closeSearchOverlay() {
  searchOverlay.classList.remove('active');
  setTimeout(() => {
    searchOverlay.style.display = 'none';
  }, 300);
}

// Event Listeners for Search Overlay
searchToggleBtn.addEventListener("click", openSearchOverlay);
closeSearchBtn.addEventListener("click", closeSearchOverlay);

// Close overlay when clicking outside
searchOverlay.addEventListener("click", (e) => {
  if (e.target === searchOverlay) {
    closeSearchOverlay();
  }
});

// Book Now functionality
function bookNow() {
  alert("🌟 Thank you for your interest! Our booking system will redirect you to our travel partners. For now, please contact us through the Contact Us section to plan your dream destination!");
}

// Form submission handler
function handleFormSubmit(event) {
  event.preventDefault();
  alert("✈️ Thank you for your message! We'll get back to you within 24 hours to help plan your perfect adventure!");
  event.target.reset();
}

const clearsearch = () => {
  query.value = "";
  searchResults.style.display = "none";
  result.innerHTML = "";
  console.log("Search cleared");
};

const clearNavSearch = () => {
  navQuery.value = "";
  searchResults.style.display = "none";
  result.innerHTML = "";
  console.log("Navigation search cleared");
};

clearbtn.addEventListener("click", clearsearch);
navClearBtn.addEventListener("click", clearNavSearch);

const showResults = (results) => {
  // Show the search results container
  searchResults.style.display = "block";

  // Create HTML for multiple results
  let resultsHTML = `<div class="results-header">
    <h2 class="results-title">Found ${results.length} destination${results.length > 1 ? 's' : ''}</h2>
    <p class="results-subtitle">Discover amazing places for your next adventure</p>
  </div>
  <div class="results-grid">`;

  results.forEach((item, index) => {
    resultsHTML += `
      <div class="result-card" style="animation-delay: ${index * 0.1}s">
        <div class="result-type-badge">${item.type}</div>
        <h3 class="result-title">${item.name}</h3>
        <img src="${item.image}" alt="${item.name}" class="result-image" onerror="this.src='https://via.placeholder.com/400x200?text=Image+Not+Available'">
        <p class="result-description">${item.description}</p>
        <div class="result-actions">
          <button class="result-btn primary" onclick="bookNow()">
            <i class="fas fa-plane"></i> Book Now
          </button>
        </div>
      </div>
    `;
  });

  resultsHTML += `</div>
  <div class="results-footer">
    <button class="result-btn secondary large" onclick="closeSearchOverlay()">
      <i class="fas fa-times"></i> Close Search
    </button>
  </div>`;

  result.innerHTML = resultsHTML;
};

const searchError = () => {
  searchResults.style.display = "block";
  result.innerHTML = `
    <div class="no-results">
      <div class="no-results-icon">
        <i class="fas fa-search"></i>
      </div>
      <h3>No destinations found</h3>
      <p class="notfound">Sorry, we couldn't find any destinations matching your search.</p>
      <div class="search-suggestions">
        <p><strong>Try searching for:</strong></p>
        <div class="suggestion-tags">
          <span class="suggestion-tag" onclick="searchSuggestion('Tokyo')">Tokyo</span>
          <span class="suggestion-tag" onclick="searchSuggestion('temple')">Temples</span>
          <span class="suggestion-tag" onclick="searchSuggestion('beach')">Beaches</span>
          <span class="suggestion-tag" onclick="searchSuggestion('Australia')">Australia</span>
          <span class="suggestion-tag" onclick="searchSuggestion('Brazil')">Brazil</span>
        </div>
      </div>
      <button class="result-btn secondary" onclick="closeSearchOverlay()">
        <i class="fas fa-times"></i> Close Search
      </button>
    </div>
  `;
};

// Function to show loading state
const showLoading = () => {
  searchResults.style.display = "block";
  result.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-compass fa-spin"></i>
      </div>
      <h3>Searching destinations...</h3>
      <p>Finding the perfect places for your adventure</p>
    </div>
  `;
};

// Function to handle search suggestions
const searchSuggestion = (suggestion) => {
  query.value = suggestion;
  // Trigger search
  document.getElementById('searchbtn').click();
};

fetch("travelrecommendation.json")
  .then((res) => res.json())
  .then((data) => {
    const search = (searchInput = null) => {
      let searchQuery = searchInput || query.value.toLowerCase().trim();
      let foundResults = [];

      // Check if search query is empty
      if (searchQuery === "") {
        alert("🔍 Please enter a destination or keyword to search!");
        return;
      }

      // Open search overlay if not already open
      if (!searchOverlay.classList.contains('active')) {
        openSearchOverlay();
      }

      // Show loading state
      showLoading();

      // Search in countries/cities
      data.countries.forEach((country) => {
        country.cities.forEach((city) => {
          if (city.name.toLowerCase().includes(searchQuery) ||
              country.name.toLowerCase().includes(searchQuery)) {
            foundResults.push({
              name: city.name,
              image: city.imageUrl,
              description: city.description,
              type: 'City'
            });
          }
        });
      });

      // Search in temples
      data.temples.forEach((temple) => {
        if (temple.name.toLowerCase().includes(searchQuery) ||
            searchQuery.includes("temple")) {
          foundResults.push({
            name: temple.name,
            image: temple.imageUrl,
            description: temple.description,
            type: 'Temple'
          });
        }
      });

      // Search in beaches
      data.beaches.forEach((beach) => {
        if (beach.name.toLowerCase().includes(searchQuery) ||
            searchQuery.includes("beach")) {
          foundResults.push({
            name: beach.name,
            image: beach.imageUrl,
            description: beach.description,
            type: 'Beach'
          });
        }
      });

      // Simulate search delay for better UX
      setTimeout(() => {
        // Display results
        if (foundResults.length > 0) {
          // Show all results (up to 6 for better UX)
          const resultsToShow = foundResults.slice(0, 6);
          showResults(resultsToShow);

          // Log all found results for debugging
          console.log(`Found ${foundResults.length} result(s):`, foundResults);
        } else {
          searchError();
        }
      }, 800); // 800ms delay for loading effect
    };

    searchbtn.addEventListener("click", search);

    // Navigation search functionality
    const navSearch = () => {
      const navSearchQuery = navQuery.value.toLowerCase().trim();
      search(navSearchQuery);
    };

    navSearchBtn.addEventListener("click", navSearch);

    // Add Enter key support for search
    query.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        search();
      }
    });

    // Add Enter key support for navigation search
    navQuery.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        navSearch();
      }
    });
  })
  .catch((error) => {
    console.error("Error loading travel data:", error);
    alert("⚠️ Error loading travel destinations. Please try again later.");
  });

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add scroll effect to floating nav
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.floating-nav');
  if (window.scrollY > 100) {
    nav.style.background = 'rgba(255, 255, 255, 0.98)';
    nav.style.backdropFilter = 'blur(20px)';
  } else {
    nav.style.background = 'rgba(255, 255, 255, 0.95)';
    nav.style.backdropFilter = 'blur(20px)';
  }
});
