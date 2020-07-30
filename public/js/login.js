/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

if(accessToken&&user_info){
    window.location.replace('/profile.html');
}




$('.form').find('input, textarea').on('keyup blur focus', function (e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if( $this.val() === '' ) {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if( $this.val() === '' ) {
            label.removeClass('highlight');
        }
        else if( $this.val() !== '' ) {
            label.addClass('highlight');
        }
    }

});

$('.tab a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);

});


function sendSignUpData() {
    let name = document.getElementById('signup_name').value;
    let email = document.getElementById('signup_email').value;
    let password = document.getElementById('signup_password').value;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            query : `mutation createser($email: String!, $password: String!,$name:String!) {
            createUser(userInput: {email: $email, password: $password ,name :$name}) {
              id
              accessToken
            }
          }`,
            variables : {
                email: email,
                password: password,
                name: name
            }
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(result => {
            if(result.data.createUser){

                alert(`Welcome come! ${name}`);
                let {accessToken,id} = result.data.createUser;
                let user = {accessToken,id , photo :'', gender:'' };
                localStorage.setItem('accessToken', JSON.stringify(accessToken));
                localStorage.setItem('user_info', JSON.stringify(user));
                window.location.replace('/profile.html');
                // localStorage.setItem('user_info', JSON.stringify(result.data.user));
                // location.reload();
            } else {
                alert(result.error);
                // location.reload();
            }


        });
}

function sendLogINData(){
    let email = document.getElementById('signin_email').value;
    let password = document.getElementById('signin_password').value;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            query : `mutation Login($email: String!, $password: String!) {
                login(Userlogin: {email: $email, password: $password }) {
                  id
                  accessToken
                  name
              
                }
              }
              `,
            variables : {
                email: email,
                password: password,
            }
        }),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(user_info => {
            if (user_info.data.login) {
                let {accessToken, name, id } = user_info.data.login;

                // let user = {
                //     id,
                //     name,
                // };
                alert(`Welcome come! ${name}`);
                localStorage.setItem('accessToken', JSON.stringify(accessToken));
                // localStorage.setItem('user_info', JSON.stringify(user));
                window.location.replace('/profile.html');

            } else {
                alert('Wrong email or password, Please try again.');
                location.reload();
            }


        });}


function logout(){
    let ans = confirm('Confirm to logout');
    if(ans === true){
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_info');
        location.reload();
    }else{
        location.reload();
    }

}
