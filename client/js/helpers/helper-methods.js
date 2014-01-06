App.createUuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

App.ajax = function (request) {
  return new Ember.RSVP.Promise(function(resolve, reject){
    request.success = resolve;
    request.error = reject;
    Ember.$.ajax(request);
  });
};

App.ajaxGet = function (request) {
  request.type = 'GET';
  return App.ajax(request);
};

App.ajaxPost = function (request) {
  request.type = 'POST';
  return App.ajax(request);
};

App.ajaxPut = function (request) {
  request.type = 'PUT';
  return App.ajax(request);
};

App.ajaxDelete = function (request) {
  request.type = 'DELETE';
  return App.ajax(request);
};

App.getAjaxError = function (response) {
  if (response) {
    if (response.responseJSON && response.responseJSON.error) {
      return response.responseJSON.error;
    }
    return response.statusText;
    //return 'Server error: ' + response.statusText;
  }
  return 'Unknown error';
};

App.createCookie = function (name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
};

App.readCookie = function (name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

App.eraseCookie = function (name) {
  App.createCookie(name, "" , -1);
};

// enable flash messages
App.flash = window.toastr;

App.flash.serverError = function (title, err) {
  var message;
  if (err.responseJSON && err.responseJSON.error) {
    message = err.responseJSON.error;
  }
  else {
    message = err.status + ' ' + err.statusText;
  }
  App.flash.error(message, title);
  return message;
};

// enable keyboard shortcuts in views
var key = window.key.noConflict();
Ember.View.reopen({
  bindKey: function (shortcut, action) {
    var controller = this.controller;
    key(shortcut, function () {
      controller.send(action);
    });
  },
  unbindKey: function (shortcut) {
    key.unbind(shortcut);
  }
});

// ember data transforms
App.TagsTransform = DS.Transform.extend({
  serialize: function(value) {
    return value && value.toArray ? value.toArray() : [];
  },
  deserialize: function(value) {
    return Ember.A(value);
  }
});
