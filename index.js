const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSET_URL = BASE_URL + 'posters/'
const MOVIES_PER_PAGE = 12 // 單頁顯示電影數量

const movies = []
let filteredMovie = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

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

function addFavoriteMovie (id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  
  if (list.some(movie => movie.id === id)){
    return alert('已加入喜愛名單內')
  }

  list.push(movie)
  console.log(list)

  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  
 
}

dataPanel.addEventListener('click', function onPanelClick(event){
  if (event.target.matches('.btn-show-movie')){
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')){
    addFavoriteMovie(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return 
  const page = Number(event.target.dataset.page)
  renderMovieList(getMovieByPage(page))
})

function getMovieByPage (page){
  const data = filteredMovie.length ? filteredMovie : movies // '三元運算式' 條件 ? (true -> 執行a) : (false -> 執行b) 
  const startPage = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startPage, startPage + MOVIES_PER_PAGE)
}

function renderPaginator (amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++){
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>
    `
  }
  
  paginator.innerHTML = rawHTML
}

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
                class="btn btn-info btn-add-favorite"
                data-id ="${item.id}"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  });
  dataPanel.innerHTML = rawHTML
}

axios
  .get(INDEX_URL)
  .then( response => {
    movies.push(...response.data.results)
    // console.log(movies)
    renderMovieList(getMovieByPage(1))
    renderPaginator(movies.length)
  })
  .catch(err => console.log(err))

// submit 
searchForm.addEventListener('submit', function onSearchFormSubit(event){
  event.preventDefault()
  let keyword = searchInput.value.trim().toLowerCase()

  filteredMovie = movies.filter((movie) => 
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovie.length === 0){
    return alert (`查無此資料: ${keyword} `)
  } 
  
  renderPaginator(filteredMovie.length)
  renderMovieList(getMovieByPage (1))

})