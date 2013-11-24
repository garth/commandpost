// /*global QUnit:true, module:true, test:true, asyncTest:true, expect:true*/
// /*global start:true, stop:true ok:true, equal:true, notEqual:true, deepEqual:true*/
// /*global notDeepEqual:true, strictEqual:true, notStrictEqual:true, raises:true*/
// /*global visit:true, find:true, fillIn:true, click:true, keyEvent:true, wait:true, exists:true*/

// //= require qunit
// //= require_self
// //= require_tree .

// App.rootElement = '#qunit-fixture';
// Ember.testing = true;
// App.setupForTesting();
// App.injectTestHelpers();

// // store the ajax method for later restore
// App.realAjax = App.ajax;

// // mock ajax calls
// App.mockAjax = function (mockHandler, asyncTimeout) {
//   App.ajax = function (request) {
//     return new Ember.RSVP.Promise(function(resolve, reject){
//       if (asyncTimeout) {
//         setTimeout(function () {
//           mockHandler(request, resolve, reject);
//         }, asyncTimeout);
//       }
//       else {
//         mockHandler(request, resolve, reject);
//       }
//     });
//   };
// };

// // restore the original ajax method
// App.unmockAjax = function () {
//   App.ajax = App.realAjax;
// };


// var oldToken = localStorage.auth_token;

// App.mockAuth = function (authToken) {
//   oldToken = localStorage.auth_token;
//   if (!authToken) {
//     delete localStorage.auth_token;
//   }
//   else {
//     localStorage.auth_token = authToken;
//   }
// };

// App.unmockAuth = function () {
//   localStorage.auth_token = oldToken;
// };

// App.testSetup = function () {
//   App.mockAuth();
//   App.reset();
// };

// App.testTeardown = function () {
//   App.unmockAjax();
//   visit('/');
//   App.unmockAuth();
// };

// App.integrationTestModule = {
//   setup: App.testSetup,
//   teardown: App.testTeardown
// };

// var exists = function (selector) {
//   return !!find('form.form-signin').length;
// };
