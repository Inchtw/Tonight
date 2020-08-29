/* eslint-disable no-undef */

app.init = function() {
  const carouselQuery = ` {
        cocktailThree{
          hots{
            id
            name
            ori_image
            resource
            rank
            category
            comment
            views
            likes
            
          }
          tops{
             id
            name
            ori_image
            resource
            rank
            category
            comment
            views
            likes
          }
          news{
             id
            name
            ori_image
            resource
            rank
            category
            comment
            views
            likes
          }
        }
        
      }
      `;

  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      query: carouselQuery,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer '+ accessToken,
    },
  } ).then((res) => res.json())
      .then((res)=>{
        const {data} = res;

        getCarousel(data.cocktailThree.hots, 'Hots');
        getCarousel(data.cocktailThree.news, 'News');
        getCarousel(data.cocktailThree.tops, 'Tops');
      });
};


function getCarousel(cocktailArray, version) {
  cocktailArray.forEach((recipe) => {
    const category = recipe['category'].split(' ', 1).join('').split('-', 1);
    let likes = 0;
    let views= 0;
    let comment = 0;

    const card = $('<div class="card mb-4 shadow-sm"></div>');
    const img = $(`<div class="card-img-top overflow-hidden "
        style=" height: 250px; background-image: url('${recipe.ori_image}'); background-repeat: no-repeat; background-size: cover; background-position: inherit center;">
    </div>`);
    const cardbody = $(`<div class=" card-body position-relative ">
        <h5 class="card-title d-flex justify-content-between align-items-center ">${recipe.name}
            <button class="btn btn-sm float-right "><i id="${version}_${recipe.id}" class="fa fa-heart-o"></i>
            </button>
        </h5>
        <button class="btn btn-sm btn-primary position-absolute cate_btn ">
           ${category}</button>
        <p class="card-text mb-0  "> From:
        ${recipe.resource}
        </p>
    </div>`);


    const rank_stars = $('<div class="cocktail_ranking"></div>');

    if (recipe.rank) {
      for (i=0; i< 5-Math.floor(recipe.rank); i++) {
        rank_stars.append($('<span class="float-right"><i class="text-warning fa fa-star-o"></i></span>'));
      }

      for (i=0; i<Math.floor(recipe.rank); i++) {
        rank_stars.append($('<span class="float-right"><i class="text-warning fa fa-star"></i></span>'));
      }
    } else {
      rank_stars.append($(`<span class="float-right"><i class="text-warning fa fa-star-o"></i></span>
            <span class="float-right"><i class="text-warning fa fa-star-o"></i></span>
            <span class="float-right"><i class="text-warning fa fa-star-o"></i></span>
            <span class="float-right"><i class="text-warning fa fa-star-o"></i></span>
            <span class="float-right"><i class="text-warning fa fa-star-o"></i></span>`));
    }
    cardbody.append(rank_stars);
    if (recipe.views) {
      views =recipe.views;
    }
    if (recipe.comment) {
      comment = recipe.comment;
    }
    if (recipe.likes) {
      likes= recipe.likes;
    }

    const cardfooter = $(` <div class="card-footer d-flex justify-content-between">
        <small class="fa fa-eye w-25 text-center "> <span
                class="text-muted ">${views}</span></small>
        <small class="fa fa-comments-o w-25 text-center"> <span
                class="text-muted">${comment}</span></small>
        <small class="fa fa-thumbs-o-up w-25 text-center"> <span
                class="text-muted">${likes}</span></small>
    </div>`);

    card.append(img, cardbody, cardfooter);
    const a = $(`<a href="detail.html?id=${recipe.id}" class="card-group col-md-4 text-reset text-decoration-none"></a>`).append(card);

    $(`.${version}`).append(a);
  });
  const user_info = JSON.parse(localStorage.getItem('user_info'))||'';
  if (user_info) {
    user_info.likes.forEach((e)=>{
      $(`#${version}_${e.id}`).addClass('likes_color');
      $(`#${version}_${e.id}`).removeClass('fa-heart-o');
      $(`#${version}_${e.id}`).addClass('fa-heart');
    });
  }
}


window.addEventListener('DOMContentLoaded', app.init);

$(document).on('click', '#toabout', function(event) {
  event.preventDefault();
  $('html, body').animate({
    scrollTop: $( $.attr(this, 'href') ).offset().top,
  }, 500);
});
$(document).on('click', '#toAbout', function(event) {
  event.preventDefault();
  $('html, body').animate({
    scrollTop: $( $.attr(this, 'href') ).offset().top,
  }, 500);
});


// SLIDER
const speed = 400;


// var parallax = $('#scene').parallax();

for (var i = 1; i < 6; i++) {
  twinkleLoop(i);
}

function twinkleLoop(i) {
  let duration = ((Math.random() * 5) + 3);

  duration = duration - ((495 - speed)/100);
  twinkle(i, duration);

  setTimeout(function() {
    twinkleLoop(i);
  }, duration * 1000);
}

// var parallax = $('.layer').parallax();

function twinkle(id, duration) {
  const top = (Math.floor(Math.random() * 85) + 0) + '%';
  const left = (Math.floor(Math.random() * 85) + 0) + '%';

  $('#speck' + id).remove();
  $('#specks').append('<div class=\'speck\' id=\'speck' + id + '\'></div>');
  $('#speck' + id).css({
    'top': top,
    'left': left,
    'animation-duration': duration + 's',
    'animation-timing-function': 'cubic-bezier(0.250, 0.250, 0.750, 0.750)',
    'animation-name': 'twinkle',
  });
}
