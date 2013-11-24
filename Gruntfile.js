'use strict';

var request = require('request');
var portscanner = require('portscanner');

module.exports = function (grunt) {

  require('time-grunt')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    emberTemplates: {
      compile: {
        options: {
          templateBasePath: /client\/templates\//
        },
        files: {
          "public/js/templates.js": ["client/templates/**/*.hbs"]
        }
      }
    },
    browserify: {
      dist: {
        options: {
          debug: true
        },
        files: {
          'public/js/app.js': ['client/js/app.js']
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'components/jquery/jquery.js',
          'components/bootstrap/js/transition.js',
          'components/bootstrap/js/alert.js',
          'components/bootstrap/js/button.js',
          'components/bootstrap/js/carousel.js',
          'components/bootstrap/js/collapse.js',
          'components/bootstrap/js/dropdown.js',
          'components/bootstrap/js/modal.js',
          'components/bootstrap/js/scrollspy.js',
          'components/bootstrap/js/tab.js',
          'components/bootstrap/js/tooltip.js',
          'components/bootstrap/js/popover.js',
          'components/bootstrap/js/affix.js',
          'components/handlebars/handlebars.js',
          'components/ember/ember.js',
          'components/ember-data-shim/ember-data.js'
        ],
        dest: 'public/js/vendor.js',
      },
    },
    recess: {
      dist: {
        options: {
          compile: true
        },
        files: {
          'public/css/app.css': [
            'client/css/app.less'
          ]
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['components/font-awesome/fonts/*'], // include all font files
            dest: 'public/fonts/',
            filter: 'isFile'
          }
        ]
      }
    },
    jshint: {
      options: require('./jshint-options'),
      files: [
        'client/**/*.js',
        'server/**/*.js',
        'test/**/*.js',
        '*.js'
      ]
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          colors: true
        },
        src: ['test/*.js']
      }
    },
    develop: {
      server: {
        file: 'app.js',
        env: { NODE_ENV: 'development' }
      },
      testServer: {
        file: 'app.js',
        env: { NODE_ENV: 'test' }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      css: {
        files: ['client/**/*.less'],
        tasks: ['recess', 'delayed-livereload']
      },
      vendor: {
        files: [
          'components/**/*.js'
        ],
        tasks: ['concat']
      },
      templates: {
        files: ['client/templates/**/*.hbs'],
        tasks: ['emberTemplates']
      },
      browserify: {
        files: ['client/**/*.js'],
        tasks: ['browserify']
      },
      app: {
        files: [
          'app.js',
          'server/**/*.js',
          'config/*.js',
          'public/js/*.js',
          'test/**/*.js'
        ],
        tasks: ['jshint', 'delayed-livereload', 'exec:runTests']
      }
    },
    exec: {
      runTests: {
        cmd: 'grunt testWithoutBuild'
      }
    }
  });

  grunt.config.requires('watch.app.files');
  files = grunt.config('watch.app.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.',
    function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),
        function(err, res) {
        var reloaded = !err && res.statusCode === 200;
        if (reloaded) {
          grunt.log.ok('Delayed live reload successful.');
        }
        else {
          grunt.log.error('Unable to make a delayed live reload.');
        }
        done(reloaded);
      });
    }, 500);
  });

  grunt.registerTask('waitForPort', 'Waits until a port is open', function() {
    grunt.log.write('Waiting to the development server to come online...');
    var done = this.async();
    var timer = setInterval(function () {
      portscanner.checkPortStatus(3001, 'localhost', function (error, status) {
        if (status === 'open') {
          clearInterval(timer);
          done();
        }
        else {
          grunt.log.write('.');
        }
      });
    }, 50);
  });

  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('build', [
    'emberTemplates', 'recess', 'browserify', 'concat', 'copy'
  ]);
  grunt.registerTask('server', [
    'jshint', 'build', 'develop:server', 'exec:runTests', 'watch'
  ]);
  grunt.registerTask('test', ['jshint', 'build', 'testWithoutBuild']);
  grunt.registerTask('testWithoutBuild', ['develop:testServer', 'waitForPort', 'mochaTest']);
  grunt.registerTask('default', ['test']);
};
