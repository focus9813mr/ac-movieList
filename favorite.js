const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSET_URL = BASE_URL + 'posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function showMovieModal(id) {
  const modalTitle  = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modaldate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios
    .get(INDEX_URL + id)
    .then( response => {
      const data = response.data.results
      // console.log(data)
      modalTitle.innerText = data.title
      modaldate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `
        <img src="${POSET_URL + data.image}" alt="" class="img-fluid">
      `
    })
  .catch(err => console.log(err))
}

function removeFavoriteMovie (id) {
  // const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [] <- 上面movie已宣告過相同
  if (!movies || !movies.length) return
  const movieIndes = movies.findIndex((movie) => movie.id === id)
  if (movieIndes === -1) return // index 如果找不到會回傳 -1

  movies.splice(movieIndes, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPanelClick(event){
  if (event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')){
    removeFavoriteMovie(Number(event.target.dataset.id))
  }
})

function renderMovieList (data){
  let rawHTML = ''
  //process
  data.forEach( item => {
    // html更改 Poster, title
    rawHTML += `
      <div class="col-sm-3">
        <!-- margin-bottom 2 -->
        <div class="mb-2">
          <!-- card -->
          <div class="card">
            <img 
              src="${POSET_URL + item.image}" 
              class="card-img-top" 
              alt="Movie Poster"
            >
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button 
                class="btn btn-primary btn-show-movie"
                data-bs-toggle="modal"
                data-bs-target="#movie-modal"
                data-id ="${item.id}"
                >
                  More
                </button>
              <button 
                class="btn btn-danger btn-remove-favorite"
                data-id ="${item.id}"
              >
                x
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  });
  dataPanel.innerHTML = rawHTML
}

renderMovieList(movies)


