/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// initialize app structure
const url = '/graphql';
const accessToken = JSON.parse(localStorage.getItem('accessToken'))||'';
const user_info = JSON.parse(localStorage.getItem('user_info'))||'';

if (accessToken&&user_info) {
  $('#nav_logout').removeClass('d-none');
  $('#nav_login').addClass('d-none');
}


function logout() {
  Swal.fire({
    title: 'Time to say goodbye?',
    text: 'We will miss you !',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#570FF2',
    cancelButtonColor: '##C82EF2',
    confirmButtonText: 'See you Tonight!',
  }).then((res)=>{
    if (res.value) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user_info');
      location.reload();
    } else {
      location.reload();
      return;
    }
  });
}


const app = {
  fb: {},
  state: {
    auth: null,
  }, evts: {}, accessToken,
};

// core operations

app.get = function(selector) {
  return document.querySelector(selector);
};
app.getAll = function(selector) {
  return document.querySelectorAll(selector);
};
app.createElement = function(tagName, settings, parentElement) {
  const obj = document.createElement(tagName);
  if (settings.atrs) {
    app.setAttributes(obj, settings.atrs);
  }
  if (settings.stys) {
    app.setStyles(obj, settings.stys);
  }
  if (settings.evts) {
    app.setEventHandlers(obj, settings.evts);
  }
  if (parentElement instanceof Element) {
    parentElement.appendChild(obj);
  }
  return obj;
};
app.modifyElement = function(obj, settings, parentElement) {
  if (settings.atrs) {
    app.setAttributes(obj, settings.atrs);
  }
  if (settings.stys) {
    app.setStyles(obj, settings.stys);
  }
  if (settings.evts) {
    app.setEventHandlers(obj, settings.evts);
  }
  if (parentElement instanceof Element && parentElement !== obj.parentNode) {
    parentElement.appendChild(obj);
  }
  return obj;
};
app.setStyles = function(obj, styles) {
  for (const name in styles) {
    obj.style[name] = styles[name];
  }
  return obj;
};
app.setAttributes = function(obj, attributes) {
  for (const name in attributes) {
    obj[name] = attributes[name];
  }
  return obj;
};
app.setEventHandlers = function(obj, eventHandlers, useCapture) {
  for (const name in eventHandlers) {
    if (eventHandlers[name] instanceof Array) {
      for (let i = 0; i < eventHandlers[name].length; i++) {
        obj.addEventListener(name, eventHandlers[name][i], useCapture);
      }
    } else {
      obj.addEventListener(name, eventHandlers[name], useCapture);
    }
  }
  return obj;
};
app.ajax = function(method, src, args, headers, callback) {
  const req = new XMLHttpRequest();
  if (method.toLowerCase() === 'post') { // post through json args
    req.open(method, src);
    req.setRequestHeader('Content-Type', 'application/json');
    app.setRequestHeaders(req, headers);
    req.onload = function() {
      callback(this);
    };
    req.send(JSON.stringify(args));
  } else { // get through http args
    req.open(method, src + '?' + args);
    app.setRequestHeaders(req, headers);
    req.onload = function() {
      callback(this);
    };
    req.send();
  }
};
app.setRequestHeaders = function(req, headers) {
  for (const key in headers) {
    req.setRequestHeader(key, headers[key]);
  }
};
app.getParameter = function(name) {
  let result = null; let tmp = [];
  window.location.search.substring(1).split('&').forEach(function(item) {
    tmp = item.split('=');
    if (tmp[0] === name) {
      result = decodeURIComponent(tmp[1]);
    }
  });
  return result;
};
// loading
app.showLoading = function() {
  app.get('#loading').style.display = 'block';
};
app.closeLoading = function() {
  app.get('#loading').style.display = 'none';
};


$(window).scroll(function(evt) {
  if ($(window).scrollTop()>0) {
    $('.navbar').removeClass('navbar-top');
  } else {
    $('.navbar').addClass('navbar-top');
  }
});

const s = skrollr.init();


window.addEventListener('DOMContentLoaded', app.fb.load);
