var mongoose = require('mongoose');
var Session = mongoose.model('Session');

module.exports = function (config) {

  return function (req, res, next) {
    var sessionId = req.cookies.session;
    if (sessionId) {
      Session.findById(sessionId).populate('user').exec(function (err, session) {
        if (err) {
          console.log(err);
          res.send(500, { message: 'Unexpected error.' });
        }
        else if (session.expiresOn < Date.now()) {
          res.clearCookie('session');
          res.send(401, { message: 'Session has expired.' });
        }
        else {
          req.user = session.user;

          // only extend the session once per day
          var ttl = new Date(new Date().getTime() + config.sessionTtl - 1000 * 60 * 60 * 24);
          if (session.expiresOn < ttl) {
            session.extend(function (err, session) {
              res.cookie('session', session.id, { maxAge: config.sessionTtl });
              next();
            });
          }
          else {
            next();
          }
        }
      });
    }
    else {
      res.send(401, { message: 'Authorisation required.' });
    }
  };

};
