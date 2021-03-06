/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

if (accessToken&&user_info) {
  window.location.replace('/profile.html');
}


$('.form').find('input, textarea').on('keyup blur focus', function(e) {
  const $this = $(this);
  const label = $this.prev('label');

  if (e.type === 'keyup') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type === 'blur') {
    if ( $this.val() === '' ) {
      label.removeClass('active highlight');
    } else {
      label.removeClass('highlight');
    }
  } else if (e.type === 'focus') {
    if ( $this.val() === '' ) {
      label.removeClass('highlight');
    } else if ( $this.val() !== '' ) {
      label.addClass('highlight');
    }
  }
});

$('.tab a').on('click', function(e) {
  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);
});


function sendSignUpData() {
  const name = document.getElementById('signup_name').value;
  const email = document.getElementById('signup_email').value;
  const password = document.getElementById('signup_password').value;
  const emailRegxp = /^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/;

  if (!name||!email||!password) {
    Swal.fire({
      title: 'Please input all correctly!',
      text: 'Do you want to continue?',
      icon: 'warning',
      confirmButtonText: 'OK',
    });
    return;
  }
  if (emailRegxp.test(email) != true) {
    Swal.fire({
      title: 'Please provide correct e-mail!',
      text: 'Do you want to continue?',
      icon: 'warning',
      confirmButtonText: 'OK',
    });

    document.getElementById('signup_email').focus();
    document.getElementById('signup_email').select();
    return false;
  }
  {fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      query: `mutation createser($email: String!, $password: String!,$name:String!) {
            createUser(userInput: {email: $email, password: $password ,name :$name}) {
              id
              accessToken
            }
          }`,
      variables: {
        email: email,
        password: password,
        name: name,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })
      .then((res) => res.json())
      .then(async (result) => {
        if (result.errors) {
          Swal.fire({
            title: result.errors[0].message,
            text: 'Please try again!',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          return;
        }
        if (result.data.createUser) {
          await Swal.fire({
            title: `Welcome come! ${name}! `,
            text: 'Enjoy tonight!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          }).then(()=>{
            const {accessToken, id} = result.data.createUser;
            const user = {accessToken, id, photo: '', gender: ''};
            localStorage.setItem('accessToken', JSON.stringify(accessToken));
            localStorage.setItem('user_info', JSON.stringify(user));
            window.location.replace('/profile.html');
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: `${result.error}`,
            icon: 'error',
            confirmButtonText: 'Try again!',
          });
        }
      });}
}


function sendLogINData() {
  const email = document.getElementById('signin_email').value;
  const password = document.getElementById('signin_password').value;

  if (!email||!password) {
    Swal.fire({
      title: 'Error!',
      text: 'Should not be empty',
      icon: 'error',
      confirmButtonText: 'Try again!',
    });
    return;
  }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      query: `mutation Login($email: String!, $password: String!) {
                login(Userlogin: {email: $email, password: $password }) {
                  id
                  accessToken
                  name
              
                }
              }
              `,
      variables: {
        email: email,
        password: password,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })
      .then((res) => res.json())
      .then( async (user_info) => {
        if (user_info.data.login) {
          const {accessToken, name, id} = user_info.data.login;

          // let user = {
          //     id,
          //     name,
          // };
          await Swal.fire({
            title: `Welcome ! ${name}`,
            text: 'Enjoy tonight!',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });


          localStorage.setItem('accessToken', JSON.stringify(accessToken));
          // localStorage.setItem('user_info', JSON.stringify(user));
          window.location.replace('/profile.html');
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Wrong E-mail or password',
            icon: 'error',
            confirmButtonText: 'Try again!',
          });
          // location.reload();
        }
      });
}


function logout() {
  const ans = confirm('Confirm to logout');
  if (ans === true) {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    location.reload();
  } else {
    location.reload();
  }
}

