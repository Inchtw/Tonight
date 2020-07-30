app.init = function () {


    let id = app.getParameter('id');
    if (!id) {
        window.location = './';
    }

    let query = `
    {  
        cocktails(id:${id}){
            name
            id
            category
            steps
            ingredients
            ori_image
            description
            resource
            link
            comment
            likes
            rank
            views
            author_id
        
            comments {
              rank
              id
              name
              photo
              comment
              title
              img
              rank
            }
            author {
              name
              photo
              id
            }
            recommend {
              id
              name
              ori_image
              category
              resource
              link
              likes
              rank
              views
              comment
            }
          }
        }
        `;
    // app.getRecipes(query);
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            query :query
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : 'Bearer '+ accessToken
        }
    } ).then(res => res.json())
        .then(res=>{
            let {data} = res;
            let cocktail ={};
            if(data.cocktails[0]){
                cocktail = data.cocktails[0];
            }
            console.log(cocktail);
            let {author} = cocktail;
            $('#author_id').val(author.id);

            $(document).ready(function() {
                document.title = cocktail.name;
            });
            let category = cocktail['category'].split(' ',1).join('').split('-',1);
            let likes = 0;
            let views= 0;
            let comment = 0;
            let rank_stars = $('#detailStars');

            if(cocktail.rank){
                for( let i=0;i<Math.floor(cocktail.rank);i++){
                    rank_stars.append($('<span class="fa fa-star text-warning"></span>'));
                }
                for(let i=0;i< 5-Math.floor(cocktail.rank);i++){
                    rank_stars.append($('<span class="fa fa-star-o text-warning"></span>'));
                }


                console.log(5-Math.floor(cocktail.rank));

            }else{
                rank_stars.append($(` <span class="text-warning fa fa-star-o "></span>
                <span class="text-warning fa fa-star-o "></span>
                <span class="text-warning fa fa-star-o "></span>
                <span class="text-warning fa fa-star-o "></span>
                <span class="text-warning fa fa-star-o "></span>`));
            }

            if(cocktail.views){
                views =cocktail.views;
            }
            if(cocktail.comment){
                comment = cocktail.comment;
            }
            if(cocktail.likes){
                likes=    cocktail.likes;
            }
            $('.detail_view').text(views);
            $('.detail_comment').text(comment);
            $('.detail_likes').text(likes);

            $('.product-title').text(cocktail.name);
            let author_info = $(`<a href="profile.html?id=${author.id}">
            <div class="media-object overflow-hidden author_detail_pic"
                                                style=" width: 50px; height: 50px; background-image: url('${author.photo}');background-repeat: no-repeat; background-size: cover; background-position: center center;">
                                            </div>
            </a>
            <h4><a href="profile.html?id=${author.id}" class="a_t"><strong id="detail_author" class=" author_name">
                    ${author.name}</strong></a>`);
            $('.author_detail_pic_div').append(author_info);
            $('.product-description').text(cocktail.description);

            $('.resource_link').append($(`<a href="${cocktail.link}">${cocktail.resource}</a>`));
            $('.big_detail_pic').append($(`<div class=" detail_photo"
            style=" background-image: url(${cocktail.ori_image}) ;">
         </div>`));

            let ingredient_lis='';
            cocktail.ingredients.forEach(e => {
                ingredient_lis+=`<li class="list-group-item list-group-item-action">${e}
                </li>`;
            });
            let steps_lis='';
            cocktail.steps.forEach(e => {
                steps_lis+=`<li class="list-group-item list-group-item-action">${e}
                </li>`;
            });
            $('.steps_lists').append($(steps_lis));
            $('.ingredients_lists').append($(ingredient_lis));

            let user_info = JSON.parse(localStorage.getItem('user_info'))||'';
            console.log(user_info);
            if(user_info){
                if (user_info.likes.filter(e => e.id === cocktail.id).length > 0) {
                    $('#Like_btn_bk').addClass('liked_btn_bk');
                    $('#Like_btn').addClass('liked_btn');

                }
                if(user_info.id ===author.id){
                    console.log('bbbbb');
                    $('#Sub_btn').attr('disabled', true);

                }

                if (user_info.subscriptions.filter(e => e.id === author.id).length > 0) {
                    console.log('hi');
                    // $('.sub_scribe_bk').css('background-color', 'white');
                    $('#Sub_btn').addClass('subClick');
                    $('#Sub_btn').text('Subscribed');
                    console.log('what happen');

                }

            }
            cocktail.comments.forEach(comment => {
                let commet_stars = '';

                for( let i=0;i<Math.floor(comment.rank);i++){
                    commet_stars+= '<span class="fa fa-star text-warning"></span>';
                }

                for(let i=0;i< 5-Math.floor(comment.rank);i++){
                    commet_stars+= '<span class="fa fa-star-o text-warning"></span>';
                }



                console.log(commet_stars);
                let carouselItem = $(`
             <div class="carousel-item">
            <div class=" card position-relative  active comments_cards">
                <div class="p-1">

                    <div class="pull-left d-flex align-items-center">
                        <a href="profile.html?id=${comment.id}">
                            <div class="media-object overflow-hidden comments_head"
                                style=" width: 50px; height: 50px; background-image: url('${comment.photo}');background-repeat: no-repeat; background-size: cover; background-position: center center;">
                            </div>
                        </a>

                        <h5><strong>${comment.name}</strong>
                        <div class="stars comment_stars">
                        ${commet_stars}
                        </div>
                    </div>

                </div>
                <div class="p-1 text-center comment_text">
                    <h3>${comment.title}</h3>
                    <p>${comment.comment}</p>

                </div>
                <img class="comment_photo"
                    src="${comment.img}"
                    alt="">

            </div>
            </div>`);

                $('.carousel-inner').append(carouselItem);
            });
            $('.carousel-inner').children().first().addClass('active');

            cocktail.recommend.forEach(recipe => {
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
                    <button class="btn btn-sm float-right "><i class="fa fa-heart"></i>
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
                    for(let i=0;i< 5-Math.floor(recipe.rank);i++){
                        rank_stars.append($('<span class="float-right"><i class="text-warning fa fa-star-o"></i></span>'));
                    }

                    for(let i=0;i<Math.floor(recipe.rank);i++){
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
                    likes=  recipe.likes;
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

                $('.detail_recom').append(a);


                // let user_info = JSON.parse(localStorage.getItem('user_info'))||'';
                // if(user_info){
                //     if (user_info.likes.filter(e => e.id === recipe.id).length > 0) {
                //         $('#Like_btn_bk').addClass('liked_btn_bk');
                //         $('#Like_btn').addClass('liked_btn');
                //     }
                //     console.log(recipe);
                //     if (user_info.subscriptions.filter(e => e.id === recipe.author_id).length > 0) {
                //         $('.sub_scribe_bk').css('background-color', 'white');
                //         $('#Sub_btn').addClass('subClick');
                //     }
                // }

            });

            $('#detail_section').removeClass('d-none');

        }
        );
};




window.addEventListener('DOMContentLoaded', app.init);

$(document).ready(function(){


    /* 1. Visualizing things on Hover - See next part for action on click */
    $('#stars li').on('mouseover', function(){
        var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

        // Now highlight all the stars that's not after the current hovered star
        $(this).parent().children('li.star').each(function(e){
            if (e < onStar) {
                $(this).addClass('hover');
            }
            else {
                $(this).removeClass('hover');
            }
        });

    }).on('mouseout', function(){
        $(this).parent().children('li.star').each(function(e){
            $(this).removeClass('hover');
        });
    });


    /* 2. Action to perform on click */
    $('#stars li').on('click', function(){
        var onStar = parseInt($(this).data('value'), 10); // The star currently selected
        var stars = $(this).parent().children('li.star');

        for (i = 0; i < stars.length; i++) {
            $(stars[i]).removeClass('selected');
        }

        for (i = 0; i < onStar; i++) {
            $(stars[i]).addClass('selected');
        }

        // JUST RESPONSE (Not needed)
        var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
        var msg = '';
        if (ratingValue > 1) {
            msg = 'Thanks for sharing! You rated this cocktail ' + ratingValue + ' stars.';
        }
        else {
            msg = 'Seems you don\'t like it. You rated this cocktail ' + ratingValue + ' stars.';
        }
        responseMessage(msg);
        // console.log($('.selected').length);
    });



});
function responseMessage(msg) {
    // $('.success-box').fadeIn(200);
    $('#success-box').removeClass('success-box');
    $('#success-box').addClass('success-box');
    $('.success-box div.text-message').html(  msg );
}


function likeCocktail(){
    let id = app.getParameter('id');
    let variables = {
        'id': id
    };

    let likeQuery = `mutation like($id: ID!) {
        likeCocktail(likeInput: { id: $id }) 
      }
       `;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            query :likeQuery,
            variables
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : 'Bearer '+ accessToken
        }
    } ).then(res => res.json())
        .then(res=>{
            let {data} = res;
            console.log(data);
            let user_info = JSON.parse(localStorage.getItem('user_info'))||'';

            if(data.likeCocktail){

                let now = data.likeCocktail.likes||0;
                let new_like = +now+1;
                user_info.likes.push(variables);
                localStorage.setItem('user_info', JSON.stringify(user_info));
                $('.detail_likes').text(new_like);
            }else{
                $('#Like_btn_bk').removeClass('liked_btn_bk');
                $('#Like_btn').removeClass('liked_btn');
                let now = data.likeCocktail.likes ||0;
                let new_like = +now-1;
                let newLike = user_info.likes.filter(function(el) { return el.id != id; });
                user_info.likes =  newLike;
                localStorage.setItem('user_info', JSON.stringify(user_info));
                if(new_like<0){
                    new_like=0;
                }

                $('.detail_likes').text(new_like);
            }

        });



}
function subAuthor(){
    let a_href = $('.a_t').attr('href').split('=');
    console.log(a_href[1]);

    let variables = {
        'id': a_href[1]
    };

    let subQuery = `mutation subscribe($id: ID!) {
        subscribeAuthor(SubscribeInput: {id: $id}) 
      } `;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            query :subQuery,
            variables
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : 'Bearer '+ accessToken
        }
    } ).then(res => res.json())
        .then(res=>{
            let {data} = res;
            if(res.errors){
                alert('token expired or need login to do that');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user_info');
                window.location.replace('/login.html');
            }
            console.log(data.subscribeAuthor);
            let user_info = JSON.parse(localStorage.getItem('user_info'))||'';


            if(!data.subscribeAuthor){
                $('#Sub_btn').removeClass('subClick');
                let newSub = user_info.subscriptions.filter(function(el) { return el.id != a_href[1]; });
                user_info.subscriptions =  newSub;

                localStorage.setItem('user_info', JSON.stringify(user_info));

            }else{
                user_info.subscriptions.push(variables);
                localStorage.setItem('user_info', JSON.stringify(user_info));
            }

        });



}

$(document).ready( function () {
    $('.like_btn').on('click', function(e){
        $('#Like_btn_bk').addClass('liked_btn_bk');
        $('#Like_btn').addClass('liked_btn');
    });
});

$(document).ready( function () {
    $('.sub_scribe').on('click', function(e){
        // $('.sub_scribe_bk').css('background-color', 'white');

        $('#Sub_btn').addClass('subClick');
    });
});


console.log($('#comment').val());




async function test(){
    // console.log($('#comment').val());
    // console.log($('#title').val());
    // console.log($('#stars li.selected').last().data('value'));
    // // console.log($('#customFile'));
    // // let form = $('#images');
    // let form = document.getElementById('images');
    // let formData = new FormData(form);
    // console.log($('#author_id').val());
    // let uri = '/commentimageload';
    // await fetch('/commentimageload', {
    //     method: 'POST',
    //     body: formData,
    //     headers:{
    //         'Authorization' : 'Bearer '+ accessToken
    //     }
    // })

    //     .then(res => res.json())
    //     .then(async result => {
    //         console.log(result.url);
    //     });


    console.log(cocktail_id);
}


async function CreateMyComment(){


    let cocktail_id = app.getParameter('id');

    let comment = $('#comment').val();
    let title = $('#title').val();
    $('#comment').val();
    let rank = $('#stars li.selected').last().data('value');
    let img_check = $('#customFile').val();

    if(!comment||!title||!rank||!img_check){
        alert('should fill all forms');
        return;
    }


    let variables = {comment,title ,rank , cocktail_id };
    let form = document.getElementById('images');
    let formData = new FormData(form);

    let uri = '/commentimageload';
    await fetch('/commentimageload', {
        method: 'POST',
        body: formData,
        headers:{
            'Authorization' : 'Bearer '+ accessToken
        }
    })

        .then(res => res.json())
        .then(async result => {
            console.log(result.url);

            variables.img = result.url;

            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    query : `mutation comment(
                        $cocktail_id: ID!
                        $img: String!
                        $comment: String
                        $rank: Int!
                        $title: String
                      ) {
                        commentCocktail(
                          commentInput: {
                            cocktail_id: $cocktail_id
                            img: $img
                            comment: $comment
                            rank: $rank
                            title: $title
                          }
                        ) {
                          comment
                          rank
                        }
                      }
                      `,
                    variables
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : 'Bearer '+ accessToken
                }
            })
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                    let {rank} = result.data.commentCocktail;
                    if(result.data.commentCocktail.rank){
                        alert(`You gave ${rank} score to this cocktail!`);
                        window.location.reload();
                    } else {
                        alert(result.error);
                    // location.reload();
                    }


                });

        });









}

// var check_status = false;
// var like_cnt = $('#like-cnt');
// var like_parent = $('.like-container');

// var burst = new mojs.Burst({
//     parent: like_parent,
//     radius:   { 20: 60 },
//     count: 15,
//     angle:{0:30},
//     children: {
//         delay: 250,
//         duration: 700,
//         radius:{10: 0},
//         fill:   [ '#ddca7e' ],
//         easing: 		mojs.easing.bezier(.08,.69,.39,.97)
//     }
// });

// $('#like-cnt').click(function(){
//     var t1 = new TimelineLite();
//     var t2 = new TimelineLite();
//     if(!check_status){
//         t1.set(like_cnt, {scale:0});
//         t1.set('.like-btn', {scale: 0});
//         t1.to(like_cnt, 0.6, {scale:1, background: '#ddca7e',ease: Expo.easeOut});
//         t2.to('.like-btn', 0.65, {scale: 1, ease: Elastic.easeOut.config(1, 0.3)}, '+=0.2');
//         //    t1.timeScale(5);
//         check_status=true;
//         //circleShape.replay();
//         burst.replay();
//     }
//     else{
//         t1.to(like_cnt, 1, {scale:1})
//             .to(like_cnt, 1, {scale:1, background: 'rgba(255,255,255,0.3)', ease: Power4.easeOut});
//         t1.timeScale(7);
//         check_status=false;
//     }

// });