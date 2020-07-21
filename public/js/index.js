/* eslint-disable no-undef */
app.state.tag = null;
app.state.product = null;
app.state.keyvisual = null;
app.init = function () {
    window.addEventListener('scroll', app.evts.scroll);


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });


};


window.addEventListener('DOMContentLoaded', app.init);

