
const API_KEY = "d972ddb6-12d3-468d-996c-5a1a019fb8a9";
const API_URLS = {
    premieres: "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=MAY",
    popular: "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1",
    releases: "https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=2024&month=MAY&page=1",
    expected: "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_AWAIT_FILMS",
    search: "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${input.value}page=1",
    favorites: "https://kinopoiskapiunofficial.tech/api/v2.2/films/{id}"
};

const navItems = {
    premieres: document.querySelector(".premieres"),
    expected: document.querySelector(".expected"),
    releases: document.querySelector(".releases"),
    popular: document.querySelector(".popular"),
    favorite: document.querySelector(".favorite"),
    logo: document.querySelector(".header__title"),
    input: document.querySelector(".header__input")
};

navItems.premieres.addEventListener("click", () => fetchMovies(API_URLS.premieres, showMovies));
navItems.expected.addEventListener("click", () => fetchMovies(API_URLS.expected, showExpected));
navItems.releases.addEventListener("click", () => fetchMovies(API_URLS.releases, showReleases));
navItems.popular.addEventListener("click", () => fetchMovies(API_URLS.popular, showMovies));
navItems.logo.addEventListener("click", () => fetchMovies(API_URLS.premieres, showMovies));
navItems.input.addEventListener('input', handleSearch);
navItems.favorite.addEventListener("click", () => fetchFavorites());

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

async function fetchFavorites() {
    let favoriteIds = JSON.parse(localStorage.getItem("likedMovies")) || [];
    let favoriteIdsV2 = JSON.parse(localStorage.getItem("likedMoviesV2")) || [];
    let allFavoriteIds = favoriteIds.concat(favoriteIdsV2);

    
    const moviesEl = document.querySelector(".movies");
    moviesEl.innerHTML = "";
    
    for (let id of allFavoriteIds) {
        try {
            let response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, {
                headers: {
                    'X-API-KEY': API_KEY,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let movie = await response.json();
            showMovie(movie);
        
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    }
}

function showMovie(movie) {
    console.log(movie);
    const moviesEl = document.querySelector(".movies");

    const movieEl = createMovieElement(movie, "#FF0000");
    moviesEl.appendChild(movieEl);
}

function showMovies(data) {
    if (!data || !data.items) {
        console.error('Invalid data structure:', data);
        return;
    }

    const moviesEl = document.querySelector(".movies");
    moviesEl.innerHTML = "";

    data.items.forEach((movie) => {
        const movieEl = createMovieElement(movie, "#FFFFFF");
        moviesEl.appendChild(movieEl);
    });
    updateLikedMovies();
}

function showReleases(data) {
    if (!data || !data.releases) {
        console.error('Invalid data structure:', data);
        return;
    }
    const moviesEl = document.querySelector(".movies");
    moviesEl.innerHTML = "";

    data.releases.forEach((movie) => {
        const movieEl = createMovieElementReleaseExpected(movie, "#FFFFFF");
        moviesEl.appendChild(movieEl);
    });
    updateLikedMoviesV2();
}

function showExpected(data) {
    if (!data || !data.films) {
        console.error('Invalid data structure:', data);
        return;
    }

    const moviesEl = document.querySelector(".movies");
    moviesEl.innerHTML = ""; 

    data.films.forEach((movie) => {
        const movieEl = createMovieElementReleaseExpected(movie, "#FFFFFF");
        moviesEl.appendChild(movieEl);
    });
    updateLikedMoviesV2();
}

function createMovieElement(movie, likeBtnColor) {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    const rating = getRandomRating();

    movieEl.innerHTML = `
        <div class="movie-poster">
            <div class="movie-poster__presentation">
                <img class="movie__img" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
                <div class="movie__rating ${getRatingColor(rating)}">${rating}</div>
            </div>
            <div class="movie-poster__additional-info">
                <div class="txt-info">
                    <div class="movie__title">${movie.nameRu}</div>
                    <div class="movie__category">${movie.genres.map(genre => genre.genre).join(', ')}</div>
                </div>
                <div class="like-info">
                    <button class="like-btn" data-movie-id="${movie.kinopoiskId}" onclick="toggleMovieLike(this)">
                        <i class="fa-solid fa-heart fa-xl" style="color: ${likeBtnColor};"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    return movieEl;
}

function createMovieElementReleaseExpected(movie) {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    const rating = getRandomRating();

    movieEl.innerHTML = `
        <div class="movie-poster">
            <div class="movie-poster__presentation">
                <img class="movie__img" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
                <div class="movie__rating ${getRatingColor(rating)}">${rating}</div>
            </div>
            <div class="movie-poster__additional-info">
                <div class="txt-info">
                    <div class="movie__title">${movie.nameRu}</div>
                    <div class="movie__category">${movie.genres.map(genre => genre.genre).join(', ')}</div>
                </div>
                <div class="like-info">
                    <button class="like-btn" data-movie-id-v2="${movie.filmId}" onclick="toggleMovieLikeV2(this)">
                        <i class="fa-solid fa-heart fa-xl" style="color: #FFFFFF;"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    return movieEl;
}

function toggleMovieLike(currLikeBtn) {
    const movieId = currLikeBtn.getAttribute('data-movie-id');
    let likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || [];

    if (likedMovies.includes(movieId)) {
        likedMovies = likedMovies.filter(id => id !== movieId);
        currLikeBtn.querySelector('i').style.color = "#FFFFFF";
    } else {
        likedMovies.unshift(movieId);
        currLikeBtn.querySelector('i').style.color = "#FF0000";
    }

    localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
}

function updateLikedMovies() {
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || [];
    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(button => {
        const movieId = button.getAttribute('data-movie-id');
        if (likedMovies.includes(movieId)) {
            button.querySelector('i').style.color = "#FF0000";
        }
    });
}

function toggleMovieLikeV2(currLikeBtn) {
    const movieId = currLikeBtn.getAttribute('data-movie-id-v2');
    let likedMovies = JSON.parse(localStorage.getItem('likedMoviesV2')) || [];

    if (likedMovies.includes(movieId)) {
        likedMovies = likedMovies.filter(id => id !== movieId);
        currLikeBtn.querySelector('i').style.color = "#FFFFFF";
    } else {
        likedMovies.unshift(movieId);
        currLikeBtn.querySelector('i').style.color = "#FF0000";
    }

    localStorage.setItem('likedMoviesV2', JSON.stringify(likedMovies));
}

function updateLikedMoviesV2() {
    const likedMovies = JSON.parse(localStorage.getItem('likedMoviesV2')) || [];
    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(button => {
        const movieId = button.getAttribute('data-movie-id-v2');
        if (likedMovies.includes(movieId)) {
            button.querySelector('i').style.color = "#FF0000";
        }
    });
}


function getRandomRating() {
    const min = 0.00;
    const max = 10.00;
    const decimals = 2;
    const randomFloat = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(randomFloat);
}

function getRatingColor(rating) {
    if (rating >= 7) {
        return "green";
    } else if (rating > 5) {
        return "orange";
    }
    return "red";
}

function handleSearch(event) {
    event.preventDefault();
    const searchInput = navItems.input;
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
        return;
    }

    const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films?keyword=${searchTerm}`;

    fetchMovies(url, showMovies);
}
