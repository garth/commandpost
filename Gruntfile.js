'use strict';

var portscanner = require('portscanner');
var _ = require('lodash');

var components = [
  'bower_components/jquery/jquery.js',
  'bower_components/jqueryui/ui/jquery.ui.effect.js',
  'bower_components/jqueryui/ui/jquery.ui.effect-shake.js',
  'bower_components/jqueryui/ui/jquery.ui.core.js',
  'bower_components/jqueryui/ui/jquery.ui.widget.js',
  'bower_components/jqueryui/ui/jquery.ui.mouse.js',
  'bower_components/jqueryui/ui/jquery.ui.sortable.js',
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
  'bower_components/typeahead.js/dist/typeahead.js',
  'bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
  'bower_components/keymaster/keymaster.js',
  'bower_components/inflection/lib/inflection.js',
  'bower_components/lunr.js/lunr.js',
  'node_modules/lodash/dist/lodash.js',
  'node_modules/faye/browser/faye-browser.js',
  'bower_components/momentjs/moment.js',
  'bower_components/toastr/toastr.js'
];
var debugComponents = _.union(components, [
  'bower_components/handlebars/handlebars.js',
  'bower_components/ember/ember.js'
]);
var productionComponents = _.union(components, [
  'bower_components/handlebars/handlebars.runtime.js',
  'bower_components/ember/ember.prod.js'
]);

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
      debug: {
        src: debugComponents,
        dest: 'public/js/vendor.js',
      },
      production: {
        src: productionComponents,
        dest: 'public/js/vendor.js',
      }
    },
    less: {
      dist: {
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
            src: ['bower_components/font-awesome/fonts/*'],
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
      full: {
        options: {
          reporter: 'spec',
          colors: true
        },
        src: ['test/server/*.js']
      },
      quick: {
        options: {
          reporter: 'dot',
          colors: true
        },
        src: ['test/server/*.js']
      }
    },
    // mocha_phantomjs: {
    //   all: {
    //     options: {
    //       urls: ['http://localhost:3001/test']
    //     }
    //   }
    // },
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
        tasks: ['less', 'develop:server']
      },
      vendor: {
        files: ['components/**/*.js'],
        tasks: ['concat:debug']
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
        tasks: ['develop:testServer'/*, 'exec:runClientTests'*/]
      },
    },
    exec: {
      runTests: {
        cmd: 'grunt testWithoutBuild'
      },
      runServerTests: {
        cmd: 'grunt testServerWithoutBuild'
      }//,
      // runClientTests: {
      //   cmd: 'grunt testClientWithoutBuild'
      // }
    },
    uglify: {
      publicjs: {
        options: {
          preserveComments: false,
          report: 'min' //'gzip'
        },
        files: {
          'public/js/app.js': ['public/js/app.js'],
          'public/js/templates.js': ['public/js/templates.js'],
          'public/js/vendor.js': ['public/js/vendor.js']
        }
      }
    },
    cssmin: {
      publiccss: {
        options: {
          keepSpecialComments: 0,
          report: 'min' //'gzip'
        },
        files: {
          'public/css/app.css': ['public/css/app.css']
        }
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

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  //grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('build', [
    'emberTemplates', 'less', 'browserify', 'concat:debug', 'copy'
  ]);
  grunt.registerTask('server', [
    'jshint', 'build', 'develop:server', 'exec:runTests', 'watch'
  ]);
  grunt.registerTask('testServer', [
    'jshint', 'build', 'develop:testServer', 'watch'
  ]);
  grunt.registerTask('test', [
    'jshint', 'build', 'develop:testServer', 'waitForPort', 'mochaTest:full'
  ]);
  grunt.registerTask('testWithoutBuild', [
    'develop:testServer', 'waitForPort', 'mochaTest:quick'//, 'mocha_phantomjs'
  ]);
  // grunt.registerTask('testClientWithoutBuild', [
  //   'develop:testServer', 'waitForPort', 'mocha_phantomjs'
  // ]);
  grunt.registerTask('testServerWithoutBuild', [
    'develop:testServer', 'waitForPort', 'mochaTest:quick'
  ]);
  grunt.registerTask('production', [
    'jshint', 'build', 'concat:production', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('default', ['test']);
};
