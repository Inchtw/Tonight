/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// if(accessToken&&user_info){

// Swal.fire({
//     title: 'stars! ',
//     text: 'Enjoy tonight!',
//     icon: 'success',
//     onBeforeOpen: () => {
//         Swal.showLoading();
//     },
// });

let id = app.getParameter('id');
if (id===user_info.id) {
    window.location = '/profile.html';
}


let myPostquery = ` {
  me{
    id
    name
    photo
    post{
      id
      name
      likes
      rank
      resource
      ori_image
      category
      resource
      link
      likes
      views
      comment
      
    }
    subscriptions
    {
      id
    }
    followers{
      id
  
    }
    likes{
      id
      
    }
  }
}
`;

let myLikeQuery = ` {
  me{
    name
    photo
    
    post{
      id
      
    }
    subscriptions
    {
      id
    }
    followers{
      id
  
    }
    likes{
      id
      name
      likes
      rank
      resource
      ori_image
      category
      resource
      link
      likes
      views
      comment
      
    }
  }
}
`;

let mySubQuery = ` {
  me{
    post{
      id
    }
    subscriptions{
      name
      photo
      id
      post{
        id
      }
      likes{
        id
      }
      followers{
        id
      }
    }
    followers{
      id
    }
    likes{
      id
    }
  }
  }
`;


let myFollowerQuery =`{
  me{
    post{
      id
    }
    subscriptions{
      id
    }
    followers{
      name
      photo
      id
      post{
        id
      }
      likes{
        id
      }
      followers{
        id
      }
    }
    likes{
      id
    }
  }
  }`;


let userPostquery = ` {
    users(id:${id}){
      id
      name
      photo
      
      post{
        id
        name
        likes
        rank
        resource
        ori_image
        category
        resource
        link
        likes
        views
        comment
        
      }
      subscriptions
      {
        id
      }
      followers{
        id
    
      }
      likes{
        id
        
      }
    }
  }
  `;


let userLikeQuery = ` {
    users(id:${id}){
      id
      name
      photo
      
      post{
        id
        
      }
      subscriptions
      {
        id
      }
      followers{
        id
    
      }
      likes{
        id
        name
        likes
        rank
        resource
        ori_image
        category
        resource
        link
        likes
        views
        comment
        
      }
    }
  }
  `;

let userSubQuery = ` {
    users(id:${id}){
      id
      post{
        id
      }
      subscriptions{
        name
        photo
        id
        post{
          id
        }
        likes{
          id
        }
        followers{
          id
        }
      }
      followers{
        id
      }
      likes{
        id
      }
    }
    }
  `;


let userFollowerQuery =`{
    users(id:${id}){
      id
      post{
        id
      }
      subscriptions{
        id
      }
      followers{
        name
        photo
        id
        post{
          id
        }
        likes{
          id
        }
        followers{
          id
        }
      }
      likes{
        id
      }
    }
    }`;


app.init = function () {


    let id = app.getParameter('id');
    let Query;
    if(id){
        Query = userPostquery;
        $('#change_headpic').attr('disabled', true);
        $('#head_label').removeClass('fa-plus');

    }else{
        Query = myPostquery;
        $('#follow').attr('disabled', true);
        $('#follow').addClass('d-none');
        $('#create_recipe').removeClass('d-none');
        $('#nav_logout').removeClass('d-none');
        $('#nav_login').addClass('d-none');

    }

    Swal.fire({
        background: 'none',
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });


    fetch(url, {
        method:'post',
        body: JSON.stringify({
            query : Query }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : 'Bearer '+ accessToken
        }
    })
        .then(res => res.json())
        .catch(async (error) =>{
            await Swal.fire({
                title: 'Invalid status!',
                text: 'Please Login again',
                icon: 'warning',
                confirmButtonText: 'OK',
                timer: 2000

            });

            console.error(error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user_info');
            window.location.replace('/login.html');
        })
        .then( async (info) =>{
            if(info.errors){
                await Swal.fire({
                    title: 'Invalid status!',
                    text: info.errors[0].message,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    timer: 2000,
                });
                // console.error(error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user_info');
                window.location.replace('/login.html');
            }

            let {data} = info;
            Swal.close();

            if(data.me){
                let {me} = data;
                localStorage.setItem('user_info', JSON.stringify(me));
                update(me);




            }else if(data.users[0]){
                let user = data.users[0];
                update(user);

            }else{

                Swal.fire({
                    title: 'Invalid!',
                    text: 'Wrong User id',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    timer: 2000,
                }).then(()=>{
                    window.location.replace('/profile.html');

                });

            }
            function update(user){
                let {followers ,  likes, name, photo , post , subscriptions ,} = user;
                $('#myposts').text(post.length);
                $('#mylikes').text(likes.length);
                $('#myfollowers').text(followers.length);
                $('#myname').text(name);
                $('.myinfo_div').prepend($(`  <div id="myphoto" class="profile_photo"
              style="background: url(${photo}) ;background-size: cover; background-position: center center;">
  
          </div>`));

                let user_info = JSON.parse(localStorage.getItem('user_info'))||'';
                if(user_info){
                    user_info.subscriptions.forEach(e=>{
                        if(e.id ===id){

                            $('#follow').addClass('user_followed');
                            $('#follow').addClass('fa-check');
                            $('#follow').text('follewed');
                        }

                    });
                }
                // $('#myintro').text();
                $('.profile_card').html('');
                getPost (post);
                $('#profileContainer').removeClass('d-none');

            }
            //     $('#myposts').text(post.length);
            //     $('#mylikes').text(likes.length);
            //     $('#myfollowers').text(followers.length);
            //     $('#myname').text(name);
            //     $('.myinfo_div').prepend($(`  <div id="myphoto" class="profile_photo"
            //     style="background: url(${photo}) ;background-size: cover; background-position: center center;">

            // </div>`));
            //     // $('#myintro').text();
            //     $('.profile_card').html('');
            //     getPost (post);



        });

};


function getPost(post){

    post.forEach(recipe => {
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
      <button class="btn btn-sm float-right "><i id="cocktail_${recipe.id}" class="fa fa-heart-o"></i>
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

        $('.profile_card').append(a);

    });
    let user_info = JSON.parse(localStorage.getItem('user_info'))||'';
    if(user_info){
        user_info.likes.forEach(e=>{
            $(`#cocktail_${e.id}`).addClass('fa-heart');
            $(`#cocktail_${e.id}`).removeClass('fa-heart-o');
            $(`#cocktail_${e.id}`).addClass('likes_color');

        });


    }

}


function getUsers (UserInfo){

    UserInfo.forEach(user =>{
    // let {followers , likes, name, photo , post ,id} =user;
        let u_post = 0;
        let u_likes= 0;
        let u_followers = 0;
        if(user.followers.length>0){
            u_followers =user.followers.length;
        }
        if(user.likes.length>0){
            u_likes = user.likes.length;
        }
        if(user.post.length>0){
            u_post=  user.post.length;
        }

        let card = $(` 
    <div class="card mb-4 shadow-sm">
        <button  id="user_${user.id}"  class="btn btn-sm  position-absolute fa text-muted fa-bookmark followMe "
            style=" margin: 1em ;">
        </button>
        <div class="card-img-top d-flex justify-content-center mt-4 ">
            <div class="media-object overflow-hidden user_photo"
                style=" background-image: url(${user.photo});">
            </div>

        </div>
        <div class=" card-body position-relative ">
            <h5 class="card-title d-flex justify-content-center align-items-center ">
                ${user.name}
            </h5>
        </div>
        <div class="card-footer d-flex justify-content-between">
            <small class="fa fa-list-alt w-25 text-center"> <span></span>
                <div class="text-muted">${u_post}</div>
            </small>
            <small class="fa fa-heart w-25 text-center"> <span></span>
                <div class="text-muted">${u_likes}</div>
            </small>
            <small class="fa fa-users w-25 text-center"> <span></span>
                <div class="text-muted">${u_followers}</div>
            </small>
        </div>
   
    </div>`);



        let a = $(`<a href="profile.html?id=${user.id}" class="card-group col-md-3 text-reset text-decoration-none"></a>`).append(card);


        $('.profile_card').append(a);

    });
    let user_info = JSON.parse(localStorage.getItem('user_info'))||'';
    if(user_info){
        user_info.subscriptions.forEach(e=>{

            $(`#user_${e.id}`).removeClass('text-muted');
            $(`#user_${e.id}`).addClass('text-warning');
        });


    }

}

function graphMeFetch(query){

    return  fetch(url, {
        method:'post',
        body: JSON.stringify({
            query : query}),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : 'Bearer '+ accessToken
        }
    })
        .then(res => res.json())
        .catch(error =>{
            Swal.fire({
                title: 'Invalid status!',
                text: 'Please Login again',
                icon: 'warning',
                confirmButtonText: 'OK',
                timer: 2000

            });

            console.error(error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user_info');
            window.location.replace('/login.html');
        })
        .then(info =>{
            if(info.errors){
                Swal.fire({
                    title: 'Invalid status!',
                    text: 'Please Login again',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    footer : 'Overtime'

                });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user_info');
                window.location.replace('/login.html');
            }
            let {data} = info;
            // let {me} = data;
            // return me;
            return data;

        }
        );
}



async function GetmyPost(){

    Swal.fire({
        background: 'none',
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });

    let id = app.getParameter('id');
    if(id){
        let data =await graphMeFetch(userPostquery);
        $('.profile_card').html('');
        getPost(data.users[0].post);
        Swal.close();


    }else{
        let data =await graphMeFetch(myPostquery);
        $('.profile_card').html('');
        getPost(data.me.post);
        Swal.close();


    }




}


async function getMyLikes(){

    Swal.fire({
        background: 'none',
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });
    let id = app.getParameter('id');
    if(id){
        let data =await graphMeFetch(userLikeQuery);
        $('.profile_card').html('');
        getPost(data.users[0].likes);
        Swal.close();

    }else{
        let data =await graphMeFetch(myLikeQuery);
        $('.profile_card').html('');
        getPost(data.me.likes);
        Swal.close();

    }
}




async function getMyFollowing(){
    Swal.fire({
        background: 'none',
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });

    let id = app.getParameter('id');
    if(id){
        let data =await graphMeFetch(userSubQuery);
        $('.profile_card').html('');
        getUsers(data.users[0].subscriptions);
        Swal.close();


    }else{
        let data =await graphMeFetch(mySubQuery);
        $('.profile_card').html('');
        getUsers(data.me.subscriptions);
        Swal.close();


    }
}



async function getMyFollower() {
    let id = app.getParameter('id');
    Swal.fire({
        background: 'none',
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });
    if(id){
        let data =await graphMeFetch(userFollowerQuery);
        $('.profile_card').html('');
        getUsers(data.users[0].followers);
        Swal.close();

    }else{
        let data =await graphMeFetch(myFollowerQuery);
        $('.profile_card').html('');
        getUsers(data.me.followers);
        Swal.close();

    }
}

function subAuthor(){
    let id = app.getParameter('id');
    if(!id){
        return;
    }
    let variables = {
        'id': id
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
                Swal.fire({
                    title: 'Invalid status!',
                    text: 'Please Login again',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    timer: 2000

                });
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user_info');
                window.location.replace('/login.html');
            }
            let user_info = JSON.parse(localStorage.getItem('user_info'))||'';


            if(!data.subscribeAuthor){
                $('#follow').removeClass('user_followed');
                $('#follow').removeClass('fa-check');
                $('#follow').text('follow');

                let newSub = user_info.subscriptions.filter(function(el) { return el.id != id; });
                user_info.subscriptions =  newSub;

                localStorage.setItem('user_info', JSON.stringify(user_info));

            }else{
                user_info.subscriptions.push(variables);
                localStorage.setItem('user_info', JSON.stringify(user_info));
            }

        });
}


$(document).ready(function () {
    $('#follow').on('click', function(e){
        $(this).removeClass('user_followed');
        $(this).addClass('user_followed');
        $(this).removeClass('fa-check');
        $(this).addClass('fa-check');
        $(this).text('follewed');

    });
});

$('#change_headpic').change ( async function() {

    var file = $('#change_headpic')[0].files[0];
    var reader = new FileReader;
    reader.onload = function( e ) {
        $( '#myphoto' ).css('background', 'url(' + e.target.result + ')');
        $( '#myphoto' ).css('background-size', 'cover');
        $( '#myphoto' ).css('background-position', 'center center');
    };
    reader.readAsDataURL( file );

    let formData = new FormData();

    formData.append( 'change_headpic', file );

    await Swal.fire({
        title: 'Sure to upload photo?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#570FF2',
        cancelButtonColor: '#C82EF2',
        confirmButtonText: 'Yes!'
    }).then(async (res)=>{

        if(res.value){
            Swal.fire({
                title: 'Uploading your picture',
                text: 'Connecting to server',
                allowOutsideClick: false,
                timer: 6000,
                timerProgressBar: true,
                onBeforeOpen: () => {
                    Swal.showLoading();
                },
            });
            fetch( '/headimageload', {
                method: 'POST',
                body: formData,
                headers:{
                    'Authorization' : 'Bearer '+ accessToken
                }
            })
                .then(res => res.json())
                .then(async result => {
                    Swal.close();
                    await Swal.fire({
                        title: 'Upload Successed!! ',
                        text: 'Enjoy tonight!',
                        icon: 'success',
                        timer: 2000,
                        timerProgressBar: true,
                    }).then(()=>{

                        location.reload();

                    });


                })
            ;

        }else{
            location.reload();
            return;
        }

    });



});

$(document).ready(function () {
    $('.list_item').on('click', function(e){
        $('.list_item').removeClass('li_selected');
        $(this).addClass('li_selected');

    });
});





window.addEventListener('DOMContentLoaded', app.init);