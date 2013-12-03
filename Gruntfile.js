'use strict';

var request = require('request');
var portscanner = require('portscanner');
var _ = require('underscore');

module.exports = function (grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    emberTemplates: {
      compile: {
        options: {
          templateBasePath: /client\/templates\//
        },
        files: {
          'public/js/templates.js': ['client/templates/**/*.hbs']
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
          'bower_components/jquery/jquery.js',
          'bower_components/bootstrap/js/transition.js',
          'bower_components/bootstrap/js/alert.js',
          'bower_components/bootstrap/js/button.js',
          'bower_components/bootstrap/js/carousel.js',
          'bower_components/bootstrap/js/collapse.js',
          'bower_components/bootstrap/js/dropdown.js',
          'bower_components/bootstrap/js/modal.js',
          'bower_components/bootstrap/js/scrollspy.js',
          'bower_components/bootstrap/js/tab.js',
          'bower_components/bootstrap/js/tooltip.js',
          'bower_components/bootstrap/js/popover.js',
          'bower_components/bootstrap/js/affix.js',
          'bower_components/handlebars/handlebars.js',
          'bower_components/ember/ember.js',
          'bower_components/ember-data/ember-data.js',
          'bower_components/showdown/src/showdown.js'
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
          'public/css/app.css': ['client/css/app.less']
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            // include all font files
            src: ['components/font-awesome/fonts/*'],
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
        src: ['test/server/*.js']
      }
    },
    mocha_phantomjs: {
      all: {
        options: {
          urls: ['http://localhost:3001/test']
        }
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
        livereload: 35729
      },
      css: {
        files: ['client/**/*.less'],
        tasks: ['recess', 'develop:server']
      },
      vendor: {
        files: ['components/**/*.js'],
        tasks: ['concat']
      },
      templates: {
        files: ['client/templates/**/*.hbs'],
        tasks: ['emberTemplates']
      },
      browserify: {
        files: ['client/js/**/*.js'],
        tasks: ['jshint', 'browserify']
      },
      server: {
        files: [
          '*.js',
          'server/**/*.js',
          'test/server/**/*.js'
        ],
        tasks: ['jshint', 'develop:server', 'exec:runServerTests']
      },
      client: {
        files: [
          'public/js/**/*.js',
          'test/client/**/*.js'
        ],
        tasks: ['develop:server', 'exec:runClientTests']
      },
    },
    exec: {
      runTests: {
        cmd: 'grunt testWithoutBuild'
      },
      runServerTests: {
        cmd: 'grunt testServerWithoutBuild'
      },
      runClientTests: {
        cmd: 'grunt testClientWithoutBuild'
      }
    }
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
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('build', [
    'emberTemplates', 'recess', 'browserify', 'concat', 'copy'
  ]);
  grunt.registerTask('server', [
    'jshint', 'build', 'develop:server', 'exec:runTests', 'watch'
  ]);
  grunt.registerTask('test', [
    'jshint', 'build', 'testWithoutBuild'
  ]);
  grunt.registerTask('testWithoutBuild', [
    'develop:testServer', 'waitForPort', 'mochaTest', 'mocha_phantomjs'
  ]);
  grunt.registerTask('testClientWithoutBuild', [
    'develop:testServer', 'waitForPort', 'mocha_phantomjs'
  ]);
  grunt.registerTask('testServerWithoutBuild', [
    'develop:testServer', 'waitForPort', 'mochaTest'
  ]);

  grunt.registerTask('default', ['test']);
};
