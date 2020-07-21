/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

if(accessToken&&user_info){
    // fetch(url, {
    //     method:'post',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         'Authorization' : 'Bearer '+ accessToken
    //     }
    // })
    //     .then(res => res.json())
    //     .catch(error =>{
    //         alert('登入逾時 請重新登入');
    //         window.location.reload('/login.html');
    //         console.error(error);
    //         localStorage.removeItem('accessToken');
    //         localStorage.removeItem('user_info');
    //     })
    //     .then(info =>{
    //         let {data} = info;
    //         let {id} =data;
    //         let {name} =data;
    //         let {picture} = data;
    //         // let {provider} = data;
    //         let add_id = document.createElement('span');
    //         add_id.innerHTML = id;
    //         profile_id.appendChild(add_id);
    //         let add_name = document.createElement('span');
    //         add_name.innerHTML = name;
    //         profile_name.appendChild(add_name);
    //         if(picture ===null ||picture ===''){
    //             // console.log("use defalut photo")
    //         }else{
    //             profile_default_img.remove();
    //             let add_img = document.createElement('img');
    //             add_img.setAttribute('src', picture);
    //             profile_photo.appendChild(add_img);
    //         }



    //     });

}else{
    alert('need login');
    window.location.replace('/login.html');


}


// app.init = function () {



// };


// window.addEventListener('DOMContentLoaded', app.init);