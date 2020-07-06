const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const dataPanel = document.getElementById("data-panel");
const searchForm = document.getElementById("search");
const searchInput = document.getElementById("search-input");
const paginator = document.getElementById("pagination");
const ITEM_PER_PAGE = 8;

const movies = [];
let filteredMovies = [];

// listen to data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    console.log("Add favorite movie id: ", event.target.dataset.id);
    addFavoriteItem(event.target.dataset.id);
  }
});

// listen to search form submit event
searchForm.addEventListener("submit", function onSearchSubmitted(event) {
  event.preventDefault();
  let keyword = searchInput.value.toLowerCase();
  if (!keyword) {
    return alert("Please enter a valid keyword");
  }

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  // 如果搜尋不到任何電影
  if (filteredMovies.length === 0) {
    alert("Cannot find any movies with keyword: " + keyword);
    searchInput.value = "";
  }

  renderPaginator(filteredMovies.length);
  renderMovieList(getMoviesByPage(1));
});

// listen to pagination click event
paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;

  console.log("Paginator clicked, page number: ", event.target.dataset.page);
  renderMovieList(getMoviesByPage(event.target.dataset.page));
});

function getMoviesByPage(pageNum) {
  const data = filteredMovies.length ? filteredMovies : movies;
  let offset = (pageNum - 1) * ITEM_PER_PAGE;
  return data.slice(offset, offset + ITEM_PER_PAGE);
}

function renderPaginator(amount) {
  let totalPages = Math.ceil(amount / ITEM_PER_PAGE) || 1;
  let pageItemContent = "";
  for (let i = 0; i < totalPages; i++) {
    pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${
      i + 1
    }</a>
        </li>
      `;
  }
  paginator.innerHTML = pageItemContent;
}

function renderMovieList(data) {
  let htmlContent = "";
  data.forEach(function (item) {
    htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button --> 
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `;
  });
  dataPanel.innerHTML = htmlContent;
}

function showMovieModal(id) {
  // get elements
  const modalTitle = document.getElementById("show-movie-title");
  const modalImage = document.getElementById("show-movie-image");
  const modalDate = document.getElementById("show-movie-date");
  const modalDescription = document.getElementById("show-movie-description");

  // send request to show api
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;

    // insert data into modal ui
    modalTitle.textContent = data.title;
    modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`;
    modalDate.textContent = `release at : ${data.release_date}`;
    modalDescription.textContent = `${data.description}`;
  });
}

function addFavoriteItem(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((item) => item.id === Number(id));

  if (list.some((item) => item.id === Number(id))) {
    return alert(`${movie.title} is already in your favorite list.`);
  }

  list.push(movie);
  alert(`Added ${movie.title} to your favorite list!`);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results);
  renderPaginator(movies.length);
  renderMovieList(getMoviesByPage(1));
});
