App.createUuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

// enable flash messages
App.flash = window.toastr;

App.flash.options = {
  "positionClass": "toast-bottom-right"
};

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
