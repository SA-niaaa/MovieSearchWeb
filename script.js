const movieSearchBox = document.getElementById("msbox");
const searchList = document.getElementById("list");
const resultGrid = document.getElementById("result");

async function loadMovies(term) {
  const url = `https://omdbapi.com/?s=${term}&page=1&apikey=1d9789fe`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.Response === "True") {
    displayMovieList(data.Search);
  }
}

function findMovies() {
  const term = movieSearchBox.value.trim();
  if (term.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(term);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.dataset.id = movie.imdbID;
    div.classList.add("item");
    const imgSrc = movie.Poster !== "N/A" ? movie.Poster : "./image/no-poster.jpg";

    div.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${imgSrc}" />
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

function attachMovieEvents() {
  const items = searchList.querySelectorAll(".item");
  items.forEach((item) => {
    item.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const res = await fetch(`http://www.omdbapi.com/?i=${item.dataset.id}&apikey=1d9789fe`);
      const details = await res.json();
      displayMovieDetails(details);
    });
  });
}

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

window.addEventListener("click", (e) => {
  if (e.target.className !== "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
