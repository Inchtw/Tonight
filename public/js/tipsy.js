/* eslint-disable no-undef */


app.init = function () {
    let category = app.getParameter('category')||'';
    let aftercursor = app.getParameter('aftercursor')||'';
    let precursor = app.getParameter('precursor')||'';
    // console.log( 'Bearer '+accessToken.replace(/['"]+/g, ''));
    console.log(accessToken);
    let page = app.getParameter('page');

    let callAfter = 'first:9';
    if(aftercursor){
        callAfter = `first:9
      after : ${aftercursor}`;

    }
    let callBefore = '';
    if(precursor){
        callBefore = `last:9
      before : ${precursor}`;

    }
    let query='';




    if(category&&!callBefore){
        $('#categories_btn').text(`${category}`);
        query= `
        {
            categories
            reciepesPaging(
             ${callAfter}
              ingredient: ""
              category: "${category}"
              author: ""
              sort: "DESC"
            ) {
              edges {
                cursor
                node {
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
              pageInfo {
                totalPageCount
                hasNextPage
                hasPreviousPage
              }
            }
          }`;
    }
    else if(category&&callBefore){
        $('#categories_btn').text(`${category}`);
        query = `
        {
            categories
            reciepesPaging(
            ${callBefore}
              ingredient: ""
              category: "${category}"
              author: ""
              sort: "DESC"
            ) {
              edges {
                cursor
                node {
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
              pageInfo {
                totalPageCount
                hasNextPage
                hasPreviousPage
              }
            }
          }`;

    }else if(!category&&!callBefore&&!callAfter){
        query = `
        {
            categories
            reciepesPaging(
            ${callAfter}
              ingredient: ""
              category: ""
              author: ""
              sort: "DESC"
            ) {
              edges {
                cursor
                node {
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
              pageInfo {
                totalPageCount
                hasNextPage
                hasPreviousPage
              }
            }
          }`;
    }
    else if (callBefore&&!category){
        query = `
        {
            categories
            reciepesPaging(
            ${callBefore}
              ingredient: ""
              category: ""
              author: ""
              sort: "DESC"
            ) {
              edges {
                cursor
                node {
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
              pageInfo {
                totalPageCount
                hasNextPage
                hasPreviousPage
              }
            }
          }`;

    }
    else {
        query = `
        {
            categories
            reciepesPaging(
            ${callAfter}
              ingredient: ""
              category: ""
              author: ""
              sort: "DESC"
            ) {
              edges {
                cursor
                node {
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
              pageInfo {
                totalPageCount
                hasNextPage
                hasPreviousPage
              }
            }
          }`;

    }
    Swal.fire({
        background: 'none',
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });

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
        // $('cocktails').innerHtml('');
            Swal.close();
            let {data} = res;
            getRecipes(data);

            let {categories} = data;
            let categories_select = $('.catesearch');

            categories.forEach(cate=>{
                categories_select.append($(`<a class="dropdown-item" href="/tipsy.html?category=${cate}">${cate}</a>`));
            });
            let hasNextPage =data.reciepesPaging.pageInfo.hasNextPage;
            let hasPreviousPage =data.reciepesPaging.pageInfo.hasPreviousPage;
            // if(hasNextPage){
            //     let next_cursor = data.reciepesPaging.edges[8].cursor;
            // }
            // if(hasPreviousPage){
            //     let pre_cursor = data.reciepesPaging.edges[0].cursor;
            // }
            let categoryEvent = '';
            if(category){
                categoryEvent = `&category=${category}`;
                console.log(categoryEvent);
            }
            let preVious = $(`<li class="page-item disabled">
            <a class="page-link tipsy_pagin" href="#" tabindex="-1">
                previous </a>
        </li>`);
            let nextP = $(`<li class="page-item disabled">
            <a class="page-link tipsy_pagin" >next</a>
        </li>`);
            if(hasNextPage) {
                let next_cursor = data.reciepesPaging.edges[8].cursor;

                nextP = $(`<li class="page-item   ">
            <a class="page-link tipsy_pagin nextP"  href="/tipsy.html?aftercursor=${next_cursor}${categoryEvent}" >next</a>
        </li>`);

            }
            if(hasPreviousPage){
                let pre_cursor = data.reciepesPaging.edges[0].cursor;
                preVious= $(`<li class="page-item   ">
                <a class="page-link tipsy_pagin preP" href="/tipsy.html?precursor=${pre_cursor}${categoryEvent}" tabindex="-1">
                    previous </a>
            </li>`);

            }

            let paginations = $('#pagnition_ul');


            paginations.append(preVious,nextP);

            $('#mianCocktails').append(paginations);

            console.log($('.nextP').val());

            // if(category){
            //     category_url = `&&category=${category}`;
            //     console.log('this is ' +category_url);
            // }
            // let lists =`<li><a href="/tipsy.html?page=1${category_url}">first</a></li>`;

            // if(hasPreviousPage){
            //     lists+=`<li><a href="/tipsy.html?page=${+page-1}${category_url}"><</a></li>`;
            // }

            // if(page){
            //     if(totalpages<=5 ){
            //         for(let i= 1; i<=totalpages;i++){
            //             lists+=`<li><a href="/tipsy.html?page=${i}${category_url}">${i}</a></li>`;
            //         }
            //     }else if(totalpages-page>5){
            //         for(let i= 0; i<5;i++){
            //             lists+=`<li><a href="/tipsy.html?page=${+page+i}${category_url}">${+page+i}</a></li>`;
            //         }
            //     }else if(totalpages-page === 5){
            //         if(page+-1>0){
            //             for(let i= -2; i<3;i++){
            //                 lists+=`<li><a href="/tipsy.html?page=${+page+i}${category_url}">${+page+i}</a></li>`;
            //             }
            //         }else{
            //             for(let i= 0; i<5;i++){
            //                 lists+=`<li><a href="/tipsy.html?page=${+page+i}${category_url}">${+page+i}</a></li>`;
            //             }
            //         }

            //     }else {
            //         if(totalpages-page>1){
            //             for(let i= -1; i<4;i++){
            //                 lists+=`<li><a href="/tipsy.html?page=${+page+i}${category_url}">${+page+i}</a></li>`;
            //             }
            //         }else{
            //             for(let i= 1; i<=5;i++){
            //                 lists+=`<li><a href="/tipsy.html?page=${+totalpages-5+i}${category_url}">${+totalpages-5+i}</a></li>`;
            //             }

            //         }

            //     }
            // }
            // if(hasNextPage){
            //     lists+=`<li><a href="/tipsy.html?page=${+page+1}${category_url}">></a></li>`;
            // }
            // lists+=`<li><a href="/tipsy.html?page=${+totalpages}${category_url}">last</a></li>`;

            // // let pages = $('<div class="page"></div>').append($('<div class="pagination"></div>').append($('<ul></ul>').append($(`${lists}`))));
            // let pages = $(`<div class="page"><div class="pagination"><ul>${lists}</ul></div></div>`);
            // $('.cocktails').append(pages);
            // let isActive = $('a');

            // for(let a of isActive){
            //     if ($(a).text().trim() == page) {
            //         console.log(a);
            //         $(a).parent().addClass('active');
            //     }
            // }



        }
        );



};



function getRecipes(data){
    let recipes = data.reciepesPaging.edges.map(edge=>{
        return edge.node;
    } );
    $('.cocktails').html('');
    $('.pagination').html('');
    recipes.forEach(recipe => {
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
            <button class="btn btn-sm float-right "><i id=cocktail_${recipe.id} class="fa fa-heart-o "></i>
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

        $('.cocktails').append(a);

    });

    let user_info = JSON.parse(localStorage.getItem('user_info'))||'';
    if(user_info){
        user_info.likes.forEach(e=>{
            $(`#cocktail_${e.id}`).addClass('fa-heart');
            $(`#cocktail_${e.id}`).removeClass('fa-heart-o');
            $(`#cocktail_${e.id}`).addClass('likes_color');
        });

        console.log(user_info);
    }


}




function search() {
    let way = $('#search_concept').text();

    let input_text = $('.serch_text').val();
    let search_q = '';
    let category= app.getParameter('category')||'';

    if(input_text){
        if(way==='Author'){
            console.log('hi');
            search_q = `{
                reciepesPaging(
                  first: 10000000
                  ingredient: ""
                  category: ""
                  author: "${input_text}"
                  sort: "DESC"
                ) {
                  edges {
                    cursor
                    node {
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
        
                  pageInfo {
                    totalPageCount
                    hasNextPage
                    hasPreviousPage
                  }
                }
              }`;

        }else{
            search_q = `{
                reciepesPaging(
                  first: 10000000
                  ingredient: "${input_text}"
                  category: ""
                  author: ""
                  sort: "DESC"
                ) {
                  edges {
                    cursor
                    node {
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
        
                  pageInfo {
                    totalPageCount
                    hasNextPage
                    hasPreviousPage
                  }
                }
              }`;
        }

    }




    // let query=`{
    //     reciepesPaging(
    //       first: 10000000
    //       ingredient: ""
    //       category: ""
    //       author: ""
    //       sort: "DESC"
    //     ) {
    //       edges {
    //         cursor
    //         node {
    //           id
    //           name
    //           ori_image
    //           category
    //           resource
    //           link
    //           likes
    //           rank
    //           views
    //           comment
    //         }
    //       }

    //       pageInfo {
    //         totalPageCount
    //         hasNextPage
    //         hasPreviousPage
    //       }
    //     }
    //   }`;

    Swal.fire({
        title: 'Searching',
        allowOutsideClick: false,
        timer: 800,
        timerProgressBar: true,
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            query :search_q
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : 'Bearer '+ accessToken
        }
    } ).then(res => res.json()
        .then(res => {
            try {
                let {data} = res;
                getRecipes(data);
                Swal.close();

            } catch{

                Swal.fire({
                    title: 'No result!',
                    text: 'Maybe try another one',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    timer: 3000

                });
            }

        })
    );
}





window.addEventListener('DOMContentLoaded', app.init);