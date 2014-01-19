Motivation
----------

Whilst there are many great online SAS backlog tools, Command Post was built to be used within
your own network by organisations where using one of the many available online services is
prohibited for any reason.

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
[NodeJS](http://nodejs.org), [Express](http://expressjs.com) and
[mongoDB](http://www.mongodb.org). Client server communication is done via
[FAYE](http://faye.jcoglan.com/) pub/sub.

Status
------

Command Post is in beta. Currently you can:

* Signup and signin
* List boards
* Create and configure boards
* Manage board lanes
* Manage board card types
* Add, edit and order cards
* Move cards between lanes
* Add comments to cards
* View changes by team members in near real-time

If you find an bug, please open a github issue.

Changelog
---------

#### 1.0.0.beta.3

* [fix] Improved realtime communication by replacing ember-data/REST with pub/sub
* [fix] Login name is no longer case sensitive
* [feature] Users can comment on cards
* [feature] Cards store lane changes in history
* [feature] Added lane types ("hidden", "queue", "in-progress" and "done")
* [feature] Moving to an "in-progress" lane, auto assignes the card to the current user
* [feature] Added initials and login name to signup form
* [feature] Users can change their name and initials on the profile page
* [feature] Various minor visual enhancements
* [performance] Improved the performance of sorting and moving cards on larger boards
* [performance] Production builds now use producion versions of client libraries

#### 1.0.0-beta.2

* [fix] Sorting cards of differing priorities now works consistently
* [feature] Added support for tagging cards
* [feature] Added support for keyboard shortcuts
* [feature] Auto-focus new cards
* [doc] Added information and sample config for Windows/IIS Deployment

#### 1.0.0-beta.1

* Initial release

Roadmap
-------

The following features are planned (in no particular order):

* Improved security constraints - Per board, roles, etc...
* Add attachments to cards
* Release management - Archive completed cards and create release notes
* Velocity estimations based on history
* Iteration markers/grouping - allow distant backlog iterations to be collapsed
* Improved automated client testing
* Improve real-time change highlighting

To contribute to one of these features, open an issue and we can discuss.

Install
-------

1. Install mongodb
2. Install nodejs
3. Clone this repository to your target machine
4. `npm install`
5. `npm install -g bower`
6. `npm install -g grunt-cli`
7. `grunt`

For installation on Windows see the [iisnode readme](docs/iisnode/readme.md).

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
