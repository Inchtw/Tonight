/* eslint-disable no-undef */


app.init = function () {
    const id = app.getParameter('id');
    if (!id) {
        window.location = './';
    }

    const query = `
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

            const {data} = res;
            const cocktail = data.cocktails[0];

            const authorlink = 'profile.html';

            $(document).ready(function() {
                document.title = cocktail.name;
            });

            const img = $(`<img class="main_image" src="${cocktail.ori_image}" alt="">`);
            const title = $(`<h2 class="title">${cocktail.name}<span>${cocktail.category}</span></h2>`);
            const source = $(`<h3 class="brief">Source :<span class="Resource"><a href="${cocktail.link}">${cocktail.resource}</a></span></h3>`);
            const author = $(`<h3 class="brief">Author :<span class="author"><a href="${authorlink}">${cocktail.author}</a></span> <span
            class="subscribe"><button href="">subscribe</button></span></h3>`);
            const des = $(`<h3 class="descriptions">Description :
            <p>${cocktail.description}</p>
        </h3>`);
            const brief = $('<div class="briefs"></div>').append(source,author,des);
            let ingredient_lis ='';
            cocktail.ingredients.forEach(e => {
                ingredient_lis+=`<li>${e}</li>`;
            });
            const ingredients = $(`<div class="ingredients">
            <h2>Ingredients</h2>
            <ul>${ingredient_lis}</ul>
            </div>`);
            let steps_lis ='';
            cocktail.steps.forEach(e => {
                steps_lis+=`<li>${e}</li>`;
            });
            const steps = $(`<div class="steps">
            <h2>Steps</h2>
            <ul>${steps_lis}</ul>
            </div>`);
            const content_top = $(' <div class="contents"></div>').append(img,brief);
            const content_bottom = $('<div class="contents"></div>').append(ingredients,steps);

            $('#mainView').append(title,content_top,content_bottom);


        }
        );

};


window.addEventListener('DOMContentLoaded', app.init);