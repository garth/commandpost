var Service = require('node-windows').Service;

var svc = new Service({
  name: 'CommandPost',
  description: 'Command Post HTTP Server',
  script: require('path').join(__dirname, '../app.js'),
  env: [
    { name: 'NODE_ENV', value: 'production' },
    { name: 'PORT', value: 80 }
  ]
});

svc.on('install', function () {
  console.log('Staring CommandPost service...');
  svc.start();
});

svc.on('start', function () {
  console.log('Ready');
});

svc.on('error', function (err) {
  console.log('Error:', err);
});

console.log('Installing CommandPost service...');
svc.install();
