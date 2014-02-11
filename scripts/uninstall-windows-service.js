var Service = require('node-windows').Service;

var svc = new Service({
  name: 'CommandPost',
  script: require('path').join(__dirname, '../app.js')
});

svc.on('uninstall', function(){
  console.log('Uninstall complete');
});

svc.on('error', function (err) {
  console.log('Error:', err);
});

console.log('Uninstalling CommandPost service...');
svc.uninstall();
