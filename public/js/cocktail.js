

app.init = function () {
    let id = app.getParameter('id');
    if (!id) {
        window.location = './';
    }

    let query = `
    {
        cocktails(id:${id}){
          id
          name
          ori_image
          description
          category
          resource
          link
          author
          ingredients
          steps
        }
      }`;
    // app.getRecipes(query);
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            query :query
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    } ).then(res => res.json())
        .then(res=>{

            let {data} = res;
            let cocktail = data.cocktails[0];

            let authorlink = 'profile.html';
            // console.log(cocktail);
            $(document).ready(function() {
                document.title = cocktail.name;
            });

            let img = $(`<img class="main_image" src="${cocktail.ori_image}" alt="">`);
            let title = $(`<h2 class="title">${cocktail.name}<span>${cocktail.category}</span></h2>`);
            let source = $(`<h3 class="brief">Source :<span class="Resource"><a href="${cocktail.link}">${cocktail.resource}</a></span></h3>`);
            let author = $(`<h3 class="brief">Author :<span class="author"><a href="${authorlink}">${cocktail.author}</a></span> <span
            class="subscribe"><button href="">subscribe</button></span></h3>`);
            let des = $(`<h3 class="descriptions">Description :
            <p>${cocktail.description}</p>
        </h3>`);
            let brief = $('<div class="briefs"></div>').append(source,author,des);
            let ingredient_lis ='';
            cocktail.ingredients.forEach(e => {
                ingredient_lis+=`<li>${e}</li>`;
            });
            let ingredients = $(`<div class="ingredients">
            <h2>Ingredients</h2>
            <ul>${ingredient_lis}</ul>
            </div>`);
            let steps_lis ='';
            cocktail.steps.forEach(e => {
                steps_lis+=`<li>${e}</li>`;
            });
            let steps = $(`<div class="steps">
            <h2>Steps</h2>
            <ul>${steps_lis}</ul>
            </div>`);
            let content_top = $(' <div class="contents"></div>').append(img,brief);
            let content_bottom = $('<div class="contents"></div>').append(ingredients,steps);

            $('#mainView').append(title,content_top,content_bottom);


        }
        );

};


window.addEventListener('DOMContentLoaded', app.init);