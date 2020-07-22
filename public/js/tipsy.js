/* eslint-disable no-undef */


app.init = function () {
    let category = app.getParameter('category')||'';
    // console.log( 'Bearer '+accessToken.replace(/['"]+/g, ''));
    console.log(accessToken);
    let page = app.getParameter('page');
    let query='';

    if (page) {
        query = `
    {
     reciepesPaging(category:"${category}",first:9,after:${(page-1)*9}){
      edges {
        node {
          id
          name
          ori_image
          category
          resource
          link
          ranking

        }
        cursor
      }
      pageInfo{
        hasNextPage
        hasPreviousPage
        totalPageCount
      }
    }
    }`;

    }else{
        page =1;
        query = `
      {
       reciepesPaging(first:9){
        edges {
          node {
            id
            name
            ori_image
            category
            resource
            link
            ranking
  
          }
          cursor
        }
        pageInfo{
          hasNextPage
          hasPreviousPage
          totalPageCount
        }
      }
      }`;
    }

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
            let {data} = res;
            let recipes = data.reciepesPaging.edges.map(edge=>{
                return edge.node;
            } );
            let totalpages = data.reciepesPaging.pageInfo.totalPageCount;
            let hasNextPage =data.reciepesPaging.pageInfo.hasNextPage;
            let hasPreviousPage =data.reciepesPaging.pageInfo.hasPreviousPage;
            recipes.forEach(recipe => {
                let category = recipe['category'].split(' ',1).join('').split('-',1);

                let h3 = $(`<h3>${recipe.name}</h3>`);
                let h6 = $(`<h6>FROM: ${recipe.resource}</6>`);
                let info = $('<div class="cocktail-info"></div>').append(h3,h6);
                let cate = $('<div class="cocktail-cata"></div>').text(`${category}`);
                let pic = $(`<div class="cocktail" style="background-image: url('${recipe.ori_image}')"></div>`);
                let a = $(`<a class="cocktail_container" href="cocktail.html?id=${recipe.id}"></a>`).append(pic,cate,info);
                $('.cocktails').append(a);
            });
            let category_url='';

            if(category){
                category_url = `&&category=${category}`;
                console.log('this is ' +category_url);
            }
            let lists =`<li><a href="/tipsy.html?page=1${category_url}">first</a></li>`;

            if(hasPreviousPage){
                lists+=`<li><a href="/tipsy.html?page=${+page-1}${category_url}"><</a></li>`;
            }

            if(page){
                if(totalpages<=5 ){
                    for(let i= 1; i<=totalpages;i++){
                        lists+=`<li><a href="/tipsy.html?page=${i}${category_url}">${i}</a></li>`;
                    }
                }else if(totalpages-page>5){
                    for(let i= 0; i<5;i++){
                        lists+=`<li><a href="/tipsy.html?page=${+page+i}${category_url}">${+page+i}</a></li>`;
                    }
                }else if(totalpages-page === 5){
                    if(page+-1>0){
                        for(let i= -2; i<3;i++){
                            lists+=`<li><a href="/tipsy.html?page=${+page+i}${category_url}">${+page+i}</a></li>`;
                        }
                    }else{
                        for(let i= 0; i<5;i++){
                            lists+=`<li><a href="/tipsy.html?page=${+page+i}${category_url}">${+page+i}</a></li>`;
                        }
                    }

                }else {
                    if(totalpages-page>1){
                        for(let i= -1; i<4;i++){
                            lists+=`<li><a href="/tipsy.html?page=${+page+i}${category_url}">${+page+i}</a></li>`;
                        }
                    }else{
                        for(let i= 1; i<=5;i++){
                            lists+=`<li><a href="/tipsy.html?page=${+totalpages-5+i}${category_url}">${+totalpages-5+i}</a></li>`;
                        }

                    }

                }
            }
            if(hasNextPage){
                lists+=`<li><a href="/tipsy.html?page=${+page+1}${category_url}">></a></li>`;
            }
            lists+=`<li><a href="/tipsy.html?page=${+totalpages}${category_url}">last</a></li>`;

            // let pages = $('<div class="page"></div>').append($('<div class="pagination"></div>').append($('<ul></ul>').append($(`${lists}`))));
            let pages = $(`<div class="page"><div class="pagination"><ul>${lists}</ul></div></div>`);
            $('.cocktails').append(pages);
            let isActive = $('a');

            for(let a of isActive){
                if ($(a).text().trim() == page) {
                    console.log(a);
                    $(a).parent().addClass('active');
                }
            }



        }
        );

};


window.addEventListener('DOMContentLoaded', app.init);