/* 
==================================================
Javascript compiled to dist
===================================================
*/
const APIURL = "https://api.themoviedb.org/3/";
const ajaxHTML = document.getElementById('ajax-data');
let genre = 0;
let type = 'movie';
let rating = 1;
let year;
let yearQuery;
let title;
let querySearch;
let hey = "2312-21-2";
let searchForm = document.getElementById("searchBtn");
searchForm.addEventListener("click", function(e){
  e.preventDefault();
  genre = document.getElementById('genre').value;
  type = document.getElementById('type').value;
  year = document.getElementById('year').value;
  rating = document.getElementById("rating").value;
  querySearch = document.getElementById("querySearch").value;
  getPosts(querySearch,  type, genre, rating, year);
});


function getPosts(querySearch, type, genre = 0, rating = 1, year = "") {
  if(type == 'movie'){
    yearQuery = "year";
  }else{
  yearQuery = "first_air_date_year"
}
   ajaxHTML.innerHTML = '';
  fetch(`${APIURL}search/${type}?api_key=7682ae2ffb72cd97f7a33b00bf175475&query=${querySearch}&${yearQuery}=${year}`)
  .then(response => response.json())
  .then(posts => {
  console.log(posts);
  if(posts.successs == 'False') {
    console.log('Nothing found');
  } else {
    console.log(posts.results);
    posts.results.forEach(post => {
        if(type == "movie"){
            yearQuery = post.release_date;
          }else if(type == "tv"){
            yearQuery = post.first_air_date; 
          }
        
    if((post.genre_ids.includes(parseInt(genre)) || genre == 0) && (rating <= post.vote_average)){
      ajaxHTML.appendChild(renderPosts(post));
      addModal(post);
    }

    });
  }
  })
  .catch(error => console.error(error));
}
function renderPosts(post) {
  if(type == "movie"){
    title = post.title;
  }else{
    title = post.name;
  }

  const postData = 
  `<img src="https://image.tmdb.org/t/p/original/${post.poster_path}" class="card-img-top" alt="${post.original_name}">`+
  `<div class="card-body">`+
    `<h5 class="card-title">${title}</h5>`+
    `<p class="card-text">${post.overview}</p>` +
  `</div>`+
  `<button type="button" class="btn btn-primary py-3" data-target="${post.id}">View more</button>`;
  
  const postWrapper = document.createElement('div');
  postWrapper.classList.add('card');
  postWrapper.innerHTML = postData;

  return postWrapper;
}
function addModal(post){
let btnns = document.querySelectorAll('.btn-primary');
btnns.forEach(element => {
  element.addEventListener('click', function(){
    console.log('hey');
    if(post.id == element.getAttribute('data-target')){
      let rating = post.vote_average;
      let lang = post.original_language;
      let year;
      let title;
      if(type == "movie"){
        year = post.release_date;
        title = post.title;
      }else{
        year = post.first_air_date; 
        title = post.name;
      }
      let movieInfo = 
    `<div "class="modal fade" id="${post.id}">` +
    `<div class="modal-dialog" id="modal-dialog" role="document">`+
    `<img src="https://image.tmdb.org/t/p/original/${post.poster_path}" class="card-img-top" alt="${post.original_name}">`+
      `<div class="modal-content">`+
        `<div class="modal-header">`+
         ` <h5 class="modal-title" id="exampleModalLongTitle">${title}</h5>`+
         `</button>`+
       `</div>`+
        `<div class="modal-body">`+
        `<ul>`+
        `<li>Rating ${rating}</li>`+
        `<li>Language ${lang.toUpperCase()}</li>`+
        `<li>Air Date ${year}</li>`+
        `</ul>` +
        `</div>`+
       `<div class="modal-footer">`+
         `<button type="button" class="btn btn-secondary" id="close" data-dismiss="modal">Close</button>`+
        `</div>`+
      `</div>`+
      `</div>`+
    `</div>`;
    let modalWrapper = document.getElementById("modals");
    modalWrapper.innerHTML = movieInfo;
    modalWrapper.firstElementChild.classList.add('active-modal');
    document.getElementById('close').addEventListener('click', function(){
      modalWrapper.firstElementChild.classList.remove('active-modal');
      modalWrapper.innerHTML = "";
    })
    }
  })
});}