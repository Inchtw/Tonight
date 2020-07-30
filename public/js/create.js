/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */


if(!accessToken&&!user_info){
    alert('need login');
    window.location.replace('/login.html');

}



async function CreateMyRecipe(){

    let name = document.getElementById('name').value;
    let category = document.getElementById('category').value;
    let steps = [];
    document.querySelectorAll('.stepsarray').forEach(Step=>steps.push(Step.value));
    let ingredients = [];
    document.querySelectorAll('.ingredientsarray').forEach(ingredient=>ingredients.push(ingredient.value));
    let description = document.getElementById('description').value;
    let variables = {name,category ,steps ,description , ingredients  };

    let form = document.getElementById('createRecipe');
    let formData = new FormData(form);

    let uri = '/imageload';


    await fetch(uri, {
        method: 'POST',
        body: formData,
        headers :{
            'Authorization' : 'Bearer '+ accessToken
        }
    })
        .then(res => res.json())
        .then(async result => {
            variables.ori_image = result.url;

            console.log(result.url);
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    query : `mutation createcocktail( $name: String!, $ori_image: String! , $description: String, $ingredients: [String!], $steps: [String!]!, $category :String!) {
                        createCocktail(cocktailInput: {name: $name , ori_image:$ori_image , description: $description,ingredients:$ingredients,steps:$steps,category:$category}) {
                          id
                          name
                          
                        }}`,
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
                    let {id} = result.data.createCocktail;
                    if(result.data.createCocktail.name){
                        alert(`Your awesome cocktail --${name} recipe has been created`);
                        window.location.replace(`/detail.html?id=${id}`);
                    } else {
                        alert(result.error);
                        // location.reload();
                    }


                });

        });




}



(function($){
    function floatLabel(inputType){
        $(inputType).each(function(){
            var $this = $(this);
            // on focus add cladd active to label
            $this.focus(function(){
                $this.next().addClass('active');
            });
            //on blur check field and remove class if needed
            $this.blur(function(){
                if($this.val() === '' || $this.val() === 'blank'){
                    $this.next().removeClass();
                }
            });
        });
    }
    // just add a class of "floatLabel to the input field!"
    floatLabel('.floatLabel');
})(jQuery);


$('#chooseFile').bind('change', function () {
    var filename = $('#chooseFile').val();
    if (/^\s*$/.test(filename)) {
        $('.file-upload').removeClass('active');
        $('#noFile').text('No file chosen...');
    }
    else {
        $('.file-upload').addClass('active');
        $('#noFile').text(filename.replace('C:\\fakepath\\', ''));
    }
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

$(document).ready(function () {
    $('#last_step').on('click', function(e){

        $('#last_step').before(`<div class="controls ">
        <input type="text" class="floatLabel stepsarray " name="Steps">
    </div>`);

    });
});

$(document).ready(function () {
    $('#last_ingredient').on('click', function(e){

        $('#last_ingredient').before(` <div class="controls">
        <input type="text" class="floatLabel stepsarray" name="ingredients">
    </div>`);

    });
});