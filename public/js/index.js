/* eslint-disable no-undef */

app.init = function () {

    let carouselQuery = ` {
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
            query :carouselQuery
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : 'Bearer '+ accessToken
        }
    } ).then(res => res.json())
        .then(res=>{
        // $('cocktails').innerHtml('');
            let {data} = res;

            console.log(data);
            // getRecipes(data);
            getCarousel(data.cocktailThree.hots,'Hots');
            getCarousel(data.cocktailThree.news,'News');
            getCarousel(data.cocktailThree.tops,'Tops');
            // let user_info = JSON.parse(localStorage.getItem('user_info'))||'';
            // if(user_info){
            //     user_info.likes.forEach(e=>{
            //         $(`#cocktail_${e.id}`).addClass('likes_color');
            //     });

            //     console.log(user_info);
            // }

        });



};


function getCarousel(cocktailArray,version){


    cocktailArray.forEach(recipe => {
        let category = recipe['category'].split(' ',1).join('').split('-',1);
        let likes = 0;
        let views= 0;
        let comment = 0;

        let card = $('<div class="card mb-4 shadow-sm"></div>');
        let img = $(`<div class="card-img-top overflow-hidden "
        style=" height: 250px; background-image: url('${recipe.ori_image}'); background-repeat: no-repeat; background-size: cover; background-position: inherit center;">
    </div>`);
        let cardbody = $(`<div class=" card-body position-relative ">
        <h5 class="card-title d-flex justify-content-between align-items-center ">${recipe.name}
            <button class="btn btn-sm float-right "><i id="${version}_${recipe.id}" class="fa fa-heart"></i>
            </button>
        </h5>
        <button class="btn btn-sm btn-primary position-absolute cate_btn ">
           ${category}</button>
        <p class="card-text mb-0  "> From:
        ${recipe.resource}
        </p>
    </div>`);


        let rank_stars = $('<div class="cocktail_ranking"></div>');

        if(recipe.rank){
            for(i=0;i< 5-Math.floor(recipe.rank);i++){
                rank_stars.append($('<span class="float-right"><i class="text-warning fa fa-star-o"></i></span>'));
            }

            for(i=0;i<Math.floor(recipe.rank);i++){
                rank_stars.append($('<span class="float-right"><i class="text-warning fa fa-star"></i></span>'));
            }
            console.log(5-Math.floor(recipe.rank));

        }else{
            rank_stars.append($(`<span class="float-right"><i class="text-warning fa fa-star-o"></i></span>
            <span class="float-right"><i class="text-warning fa fa-star-o"></i></span>
            <span class="float-right"><i class="text-warning fa fa-star-o"></i></span>
            <span class="float-right"><i class="text-warning fa fa-star-o"></i></span>
            <span class="float-right"><i class="text-warning fa fa-star-o"></i></span>`));
        }
        cardbody.append(rank_stars);
        if(recipe.views){
            views =recipe.views;
        }
        if(recipe.comment){
            comment = recipe.comment;
        }
        if(recipe.likes){
            likes=    recipe.likes;
        }

        let cardfooter = $(` <div class="card-footer d-flex justify-content-between">
        <small class="fa fa-eye w-25 text-center "> <span
                class="text-muted ">${views}</span></small>
        <small class="fa fa-comments-o w-25 text-center"> <span
                class="text-muted">${comment}</span></small>
        <small class="fa fa-thumbs-o-up w-25 text-center"> <span
                class="text-muted">${likes}</span></small>
    </div>`);

        card.append(img,cardbody,cardfooter);
        let a = $(`<a href="detail.html?id=${recipe.id}" class="card-group col-md-4 text-reset text-decoration-none"></a>`).append(card);

        $(`.${version}`).append(a);

    });
    let user_info = JSON.parse(localStorage.getItem('user_info'))||'';
    if(user_info){
        user_info.likes.forEach(e=>{
            $(`#${version}_${e.id}`).addClass('likes_color');
        });
    }



}


window.addEventListener('DOMContentLoaded', app.init);

