// Always return the app page unless this is an API request

module.exports = function(req, res){
  if (!req.url.match(/^\/api\//)) {
    res.render('app', {
      env: process.env.NODE_ENV
    });
  }
  else {
    res.send(404, req.url + ' not found.');
  }
};
