Background
----------

Command Post was built to be used on-site by individuals or organisations where using one of the
many available online services is prohibited for any reason.

Overview
--------

Command Post is an easy to use Kanban board that can be configured to match your process. It is
built for HTML5 complient browsers and has been tested with Chrome, Safari and Firefox.

Because there's no available online installation, you can view a
[screencast overview](https://plus.google.com/+GarthWilliams/posts/bvL7PDp574g) and decide if
Command Post is a good fit for your team before downloading.

Technology
----------

The client application is based on primarily on [EmberJS](http://emberjs.com),
[Bootstrap](http://getbootstrap.com) and some [jQuery UI](http://jqueryui.com). The server uses
[NodeJS](http://nodejs.org), [Express](http://expressjs.com) and [mongoDB](http://www.mongodb.org).

Status
------

Command Post is in beta. Currently you can:

* Signup
* Signin
* List boards
* Create and configure boards
* Manage board lanes
* Manage board card types
* Add and order cards
* Move cards between lanes
* View changes by team members in near real-time

If you find an bug, please open a github issue.

Roadmap
-------

The following features are planned (in no particular order):

* Add comments to cards
* Improved security constraints - Per board, roles, etc...
* Release management - Archive completed cards and create release notes
* Velocity estimations based on history
* Iteration markers/grouping
* Improved emberjs automated testing

The following are being considered:

* Replace Ember data (REST) with pub-sub style communications
* Replace mongoDB with postgresql

To contribute to one of these features, open an issue and we can discuss.

Install
-------

1. Install mongodb
2. Install nodejs
3. Clone this repository to your target machine
4. `npm install`
5. `npm install -g bower` & `bower install`
6. `npm install -g grunt-cli` & `grunt`

Configuration
-------------

Database connection strings can be found in `/server/config/config.js`.

Test
----

To run the tests one time:

`grunt test`

To run the test automatically when files change:

`grunt server`

This will also start the app in development mode on port 3000.

Build
-----

For a production/minimised build:

`grunt production`

To run:

`NODE_ENV=production node app.js`

License
-------

Command Post - A tool for managing your Kanban process

Copyright (C) 2013 Garth Williams

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
