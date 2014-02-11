Install as Windows Service
==========================

Prerequisites
-------------

Before you start, ensure that the following are installed on the Windows server:

* mongodb
* nodejs

Installation
------------

Build a production version of Command Post

```
npm install
grunt production
rm -r node_modules
npm install --production
```

Install CommandPost as service

```
npm install -g node-windows
node scripts\install-windows-service.js
```

This will setup a windows service called `CommandPost` which will listen on
port 80 in development mode. To change port or mode, edit the `install-windows-service.js`
