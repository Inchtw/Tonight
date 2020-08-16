/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
let likes = 0;
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

            if(res.errors){
                Swal.fire({
                    title: 'Invalid!',
                    text: res.errors[0].message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    timer: 3000,
                })
                    .then(()=>{
                        window.location.replace('/tipsy.html');
                    });

                return;

            }

            let {data} = res;
            let cocktail ={};
            if(data.cocktails[0]){
                cocktail = data.cocktails[0];
            }

            let {author} = cocktail;
            $('#author_id').val(author.id);

            $(document).ready(function() {
                document.title = cocktail.name;
            });
            let category = cocktail['category'].split(' ',1).join('').split('-',1);

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
            if(user_info){
                if (user_info.likes.filter(e => e.id === cocktail.id).length > 0) {
                    $('#Like_btn_bk').addClass('liked_btn_bk');
                    $('#Like_btn').addClass('liked_btn');

                }
                if(user_info.id ===author.id){
                    $('#Sub_btn').attr('disabled', true);

                }

                if (user_info.subscriptions.filter(e => e.id === author.id).length > 0) {
                    // $('.sub_scribe_bk').css('background-color', 'white');
                    $('#Sub_btn').addClass('subClick');

                    $('#subtext').addClass('fa-heart');
                    $('#subtext').removeClass('fa-heart-o');
                    $('#subtext').text('Subscribed');


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
                    <button class="btn btn-sm float-right "><i id=cocktail_${recipe.id} class="fa fa-heart-o"></i>
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
                if(user_info){
                    user_info.likes.forEach(e=>{
                        $(`#cocktail_${e.id}`).addClass('fa-heart');
                        $(`#cocktail_${e.id}`).removeClass('fa-heart-o');
                        $(`#cocktail_${e.id}`).addClass('likes_color');
                    });
                }

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
    });



});
function responseMessage(msg) {
    $('#success-box').removeClass('success-box');
    $('#success-box').addClass('success-box');
    $('.success-box div.text-message').html(  msg );
}


async function likeCocktail(){
    let id = app.getParameter('id');
    let variables = {
        'id': id
    };

    if(!accessToken&&!user_info){
        await Swal.fire({
            title: 'NEED LOGIN!',
            text: 'Only member can Like !',
            icon: 'warning',
            confirmButtonText: 'OK',
            timer: 3000,
            footer : '<a href="/login.html">Join in Tonight!!<a>'
        });
        return;
    }


    let likeQuery = `mutation like($id: ID!) {
        likeCocktail(likeInput: { id: $id }) 
      }
       `;
    await fetch(url, {
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
            if(res.errors){

                Swal.fire({
                    title: 'Invalid status!',
                    text: res.errors[0].message,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user_info');
                return;
            }
            let user_info = JSON.parse(localStorage.getItem('user_info'))||'';

            if(data.likeCocktail){
                likes+=1;
                let new_like = +likes;

                user_info.likes.push(variables);
                localStorage.setItem('user_info', JSON.stringify(user_info));
                $('.detail_likes').text(new_like);
            }else{
                $('#Like_btn_bk').removeClass('liked_btn_bk');
                $('#Like_btn').removeClass('liked_btn');
                likes-=1;
                let new_like = +likes;
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
async function subAuthor(){
    let a_href = $('.a_t').attr('href').split('=');

    let variables = {
        'id': a_href[1]
    };
    if(!accessToken&&!user_info){
        await Swal.fire({
            title: 'NEED LOGIN!',
            text: 'Only member can Subscribe !',
            icon: 'warning',
            confirmButtonText: 'OK',
            timer: 3000,
            footer : '<a href="/login.html">Join in Tonight!!<a>'
        });
        return;
    }

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
                Swal.fire({
                    title: 'Invalid status!',
                    text: res.errors[0].message,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user_info');
                return;
            }
            let user_info = JSON.parse(localStorage.getItem('user_info'))||'';


            if(!data.subscribeAuthor){
                $('#Sub_btn').removeClass('subClick');
                $('#subtext').removeClass('fa-heart');
                $('#subtext').addClass('fa-heart-o');
                $('#subtext').text('Subscribe');
                let newSub = user_info.subscriptions.filter(function(el) { return el.id != a_href[1]; });
                user_info.subscriptions =  newSub;

                localStorage.setItem('user_info', JSON.stringify(user_info));

            }else{
                user_info.subscriptions.push(variables);
                localStorage.setItem('user_info', JSON.stringify(user_info));
            }

        });



}

if(accessToken&&user_info){
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
            $('#subtext').addClass('fa-heart');
            $('#subtext').removeClass('fa-heart-o');
            $('#subtext').text('Subscribed');
        });
    });




}else{

    // $('#comment_btn').attr('disabled', true);
    $('#customFile').attr('disabled', true);
    $('.custom-file-label').text('Need login to comment');
    $('#title').attr('placeholder','Need login to comment');
    $('#title').attr('disabled', true);
    $('#comment').attr('placeholder','Need login to comment');
    $('#comment').attr('disabled', true);

}






async function CreateMyComment(){

    if(!accessToken&&!user_info){
        await Swal.fire({
            title: 'NEED LOGIN!',
            text: 'Only member can leave a comment !',
            icon: 'warning',
            confirmButtonText: '<a href="/login.html">Join in Tonight!!<a>',
            timer: 3000,
        });
        return;
    }


    let cocktail_id = app.getParameter('id');

    let comment = $('#comment').val();
    let title = $('#title').val();
    $('#comment').val();
    let rank = $('#stars li.selected').last().data('value');
    let img_check = $('#customFile').val();

    if(!comment||!title||!rank||!img_check){
        Swal.fire({
            title: 'Please input all correctly !',
            text: 'Do you want to continue?',
            icon: 'warning',
            confirmButtonText: 'OK',
            footer:' remember to upload a photo!'
        });
        return;
    }


    let variables = {comment,title ,rank , cocktail_id };
    let form = document.getElementById('images');
    let formData = new FormData(form);


    Swal.fire({
        title: 'Uploading your comment',
        text: 'Connecting to server',
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });


    let uri = '/commentimageload';
    fetch('/commentimageload', {
        method: 'POST',
        body: formData,
        headers:{
            'Authorization' : 'Bearer '+ accessToken
        }
    })

        .then(res => res.json())
        .then(async result => {

            if(result.errors){

                await Swal.fire({
                    title: 'Invalid status!',
                    text: res.errors[0].message,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    timer: 5000,
                });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user_info');
                return;
            }

            variables.img = result.url;

            await fetch(url, {
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
                .then(async (result) => {
                    Swal.close();
                    let {rank} = result.data.commentCocktail;
                    if(result.data.commentCocktail.rank){
                        await  Swal.fire({
                            title: `${rank} stars! `,
                            text: 'Enjoy tonight!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,

                        }).then(()=>{
                            window.location.reload();
                        });

                        window.location.reload();
                    } else {

                        Swal.fire({
                            title: 'Error!',
                            text: `${result.error}`,
                            icon: 'error',
                            confirmButtonText: 'Try again!'
                        }).then(()=>{
                            return;

                        });
                    }


                });

        });






}

$(document).ready( function () {
    $('#customFile').bind('change', function () {
        var filename = $('#customFile').val();

        $('#customFile_label').text(filename.replace('C:\\fakepath\\', ''));

    });
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#preview')
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}