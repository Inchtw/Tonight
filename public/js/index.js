/* eslint-disable no-undef */
app.state.tag = null;
app.state.product = null;
app.state.keyvisual = null;
app.init = function () {
    window.addEventListener('scroll', app.evts.scroll);
};


window.addEventListener('DOMContentLoaded', app.init);