/*global QUnit:true, module:true, test:true, asyncTest:true, expect:true*/
/*global start:true, stop:true ok:true, equal:true, notEqual:true, deepEqual:true*/
/*global notDeepEqual:true, strictEqual:true, notStrictEqual:true, raises:true*/
/*global visit:true, find:true, fillIn:true, click:true, keyEvent:true, wait:true, exists:true*/

module("Login Tests", App.integrationTestModule);

asyncTest("navigate to login", function() {
  visit('/login').then(function () {
    ok(exists('form.form-signin'));
    start();
  });
});

asyncTest("can login", function() {
  // mock the ajax call
  App.mockAjax(function (request, resolve, reject) {
    equal(request.url, '/api/session', 'ajax url was ' + request.url);
    equal(request.type, 'POST', 'ajax type was ' + request.type);
    equal(request.data.email, 'garth@wi.llia.ms', 'email was ' + request.data.email);
    equal(request.data.password, 'testpass', 'password was ' + request.data.password);
    resolve({
      "users": [{ "id": 1, "first_name": "Garth", "last_name": "Williams",
                  "email": "garth@wi.llia.ms", "organisation_id": 1 }],
      "organisations": [{ "id": 1, "name": "The Org", "slug": "the-org" }],
      "session": { "auth_token": "uuHzQF7bgtkysZd7-FCzfQ", "user_id": 1 }
    });
    console.log('xxxx');
  });

  // navigate
  visit('/login').then(function () {
    // fill in the login form
    fillIn('input[type=text]', 'garth@wi.llia.ms');
    fillIn('input[type=password]', 'testpass');
    //submit the form
    click('button[type=submit]');

    console.log('yyyy');
    //ok(exists('.container.organisation'));
    start();
  });
});
