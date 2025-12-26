const movieSearchBox = document.getElementById("msbox");
const searchList = document.getElementById("list");
const resultGrid = document.getElementById("result");

const API_KEY = "1d9789fe";
const BASE_URL = "https://www.omdbapi.com/";

// Load movies while typing
async function loadMovies(term) {
  try {
    const response = await fetch(
      `${BASE_URL}?s=${encodeURIComponent(term)}&page=1&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      displayMovieList(data.Search);
    } else {
      searchList.innerHTML = "";
    }
  } catch (error) {
    console.error("Error fetching movie list:", error);
  }
}

// Trigger search
function findMovies() {
  const term = movieSearchBox.value.trim();

  if (term.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(term);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

// Display search results
function displayMovieList(movies) {
  searchList.innerHTML = "";

  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.dataset.id = movie.imdbID;

    const poster =
      movie.Poster !== "N/A" ? movie.Poster : "./image/no-poster.jpg";

    div.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${poster}" />
      </div>
      <div class="search-item-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;

    searchList.appendChild(div);
  });

  attachMovieEvents();
}

// Attach click events to movie items
function attachMovieEvents() {
  const items = searchList.querySelectorAll(".item");

  items.forEach((item) => {
    item.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";

      try {
        const response = await fetch(
          `${BASE_URL}?i=${item.dataset.id}&apikey=${API_KEY}`
        );
        const data = await response.json();
        displayMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    });
  });
}

// Show movie details

function displayMovieDetails(data) {
  const poster = data.Poster !== "N/A" ? data.Poster : "./image/no-poster.jpg";
  resultGrid.innerHTML = `
    <div class="movie-poster">
      <img src="${poster}" alt="movie poster" />
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${data.Title}</h3>
      <ul class="movie-misc-info">
        <li class="year">Year: ${data.Year}</li>
        <li class="rated">Ratings: ${data.Rated}</li>
        <li class="released">Released: ${data.Released}</li>
      </ul>
      <p class="genre"><b>Genre:</b> ${data.Genre}</p>
      <p class="writer"><b>Writer:</b> ${data.Writer}</p>
      <p class="actors"><b>Actors:</b> ${data.Actors}</p>
      <p class="plot"><b>Overview:</b> ${data.Plot}</p>
      <p class="language"><b>Language:</b> ${data.Language}</p>
      <p class="awards"><b><i class="fa-solid fa-trophy"></i></b> ${data.Awards}</p>
    </div>
  `;
}
// Hide search list when clicking outside
window.addEventListener("click", (e) => {
  if (e.target.className !== "form-control") {
    searchList.classList.add("hide-search-list");
  }
});