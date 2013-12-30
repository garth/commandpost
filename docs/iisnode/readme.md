Windows (IIS) Deployment
========================

Prerequisites
-------------

Before you start, ensure that the following are installed on the Windows server:

* IIS
* rewrite 2.0
* iisnode
* mongodb

Installation
------------

Build a production version of Command Post

```
npm install
bower install
grunt production
rm -r node_modules
npm install --production
```

Copy `iisnode.js` and `web.config` from this folder to /public

Setup an IIS website and point it at /public.
