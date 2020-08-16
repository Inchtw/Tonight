/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */







if(!accessToken&&!user_info){
    Swal.fire({
        title: 'NEED LOGIN!',
        text: 'Only member can create !',
        icon: 'warning',
        confirmButtonText: 'Join in now!!',
        timer: 2000,
    }).then(()=>{

        window.location.replace('/login.html');
    });


    // window.location.replace('/login.html');

}else{
    $('#createRecipe').removeClass('d-none');
    $('#nav_logout').removeClass('d-none');
    $('#nav_login').addClass('d-none');



    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            query : `{
                categories
              }`
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization' : 'Bearer '+ accessToken
        }
    } ).then(res => res.json())
        .then(res =>{
            let categories_select = $('.cateshow');
            categories.forEach(cate=>{
                categories_select.append($(`<option class="dropdown-item">${cate}</option>`));
            });
        });


}









async function CreateMyRecipe(){

    let name = document.getElementById('name').value;
    let category = $('#Category').val();
    // document.getElementById('category').value;
    let steps = [];
    document.querySelectorAll('.stepsarray').forEach(Step=>{
        if(Step.value){
            steps.push(Step.value);
        }
    });
    let ingredients = [];
    document.querySelectorAll('.ingredientsarray').forEach(ingredient=>{
        if(ingredient.value){
            ingredients.push(ingredient.value);
        }
    });
    let description = document.getElementById('description').value;
    let variables = {name,category ,steps ,description , ingredients  };


    if(!name||!category||!steps.length||!ingredients.length||!description){
        Swal.fire({
            icon: 'warning',
            title: 'Empty input',
            text: 'Should fill all!',
        });
        return;

    }

    let form = document.getElementById('createRecipe');
    let formData = new FormData(form);

    let uri = '/imageload';

    Swal.fire({
        title: 'Uploading...',
        text: 'Connecting to server',
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        onBeforeOpen: () => {
            Swal.showLoading();
        },
    });


    await fetch(uri, {
        method: 'POST',
        body: formData,
        headers :{
            'Authorization' : 'Bearer '+ accessToken
        }
    })
        .then(response => {
            if (!response.ok) {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
                throw new Error(response.statusText);

            }
            return response.json();
        })
        .catch(error => {
            Swal.showValidationMessage(
                `Request failed: ${error}`
            );
        })

        .then(async result => {


            variables.ori_image = result.url;

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
                .then(async (result) => {
                    Swal.close();
                    let {id} = result.data.createCocktail;
                    if(result.data.createCocktail.name){


                        await  Swal.fire({
                            icon: 'success',
                            title: 'Awesome cocktail uploaded!',
                            text: `${name} recipe has been created`,


                        });
                        window.location.replace(`/detail.html?id=${id}`);
                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            footer : `${result.error}`
                        });
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
        <input type="text" class="floatLabel ingredientsarray" name="ingredients">
    </div>`);

    });
});