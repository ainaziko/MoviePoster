const API_KEY = "5d603114-fdf5-45a8-bc1d-7aab3eb3955c";
const API_URLS = {
    premieres: "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=MAY",
    popular: "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1",
    releases: "https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=2024&month=MAY&page=1",
    expected: "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS"
};

const navItems = {
    premieres: document.querySelector(".premieres"),
    expected: document.querySelector(".expected"),
    releases: document.querySelector(".releases"),
    popular: document.querySelector(".popular"),
    favorite: document.querySelector(".favorite"),
    logo: document.querySelector(".header__title"),
    search: document.querySelector(".header__input")
};

navItems.premieres.addEventListener("click", () => fetchMovies(API_URLS.premieres, showMovies));
navItems.expected.addEventListener("click", () => fetchMovies(API_URLS.expected, showExpected));
navItems.releases.addEventListener("click", () => fetchMovies(API_URLS.releases, showReleases));
navItems.popular.addEventListener("click", () => fetchMovies(API_URLS.popular, showMovies));
navItems.logo.addEventListener("click", () => fetchMovies(API_URLS.premieres, showMovies));


fetchMovies(API_URLS.premieres, showMovies);

async function fetchMovies(url, displayFunction) {
    try {
        const response = await fetch(url, {
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        displayFunction(responseData);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function showMovies(data) {
    if (!data || !data.items) {
        console.error('Invalid data structure:', data);
        return;
    }

    const moviesEl = document.querySelector(".movies");
    moviesEl.innerHTML = "";

    data.items.forEach((movie) => {
        const movieEl = createMovieElement(movie);
        moviesEl.appendChild(movieEl);
    });
}

function showReleases(data) {
    if (!data || !data.releases) {
        console.error('Invalid data structure:', data);
        return;
    }

    const moviesEl = document.querySelector(".movies");
    moviesEl.innerHTML = "";

    data.releases.forEach((movie) => {
        const movieEl = createMovieElement(movie);
        moviesEl.appendChild(movieEl);
    });
}

function showExpected(data) {
    if (!data || !data.films) {
        console.error('Invalid data structure:', data);
        return;
    }

    const moviesEl = document.querySelector(".movies");
    moviesEl.innerHTML = ""; 

    data.films.forEach((movie) => {
        const movieEl = createMovieElement(movie);
        moviesEl.appendChild(movieEl);
    });
}

function createMovieElement(movie) {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
        <div class="movie__cover">
            <img class="movie__img" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
            <div class="movie__rating">${movie.ratingKinopoisk != null ? movie.ratingKinopoisk : ''}</div>
        </div>
        <div class="movie__info">
            <div class="movie__title">${movie.nameRu}</div>
            <div class="movie__category">${movie.genres.map(genre => genre.genre).join(', ')}</div>
        </div>
    `;

    return movieEl;
}