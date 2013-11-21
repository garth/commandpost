module.exports = {
  bitwise: false,
  newcap: true,
  eqeqeq: true,
  immed: false,
  nomen: false,
  onevar: false,
  plusplus: false,
  regexp: false,
  strict: false,
  undef: true,
  white: false,
  debug: false,
  //es5: true,
  evil: false,
  forin: false,
  laxbreak: false,
  sub: false,
  maxlen: 100,
  indent: 2,
  maxerr: 50,
  passfail: false,
  globals: {
    Ember: true,
    EmberFC: true,
    DS: true,
    App: true,
    test: true,
    ok: true,
    console: true,
    '$': true,
    describe: true,
    it: true,
    before: true,
    beforeEach: true
  },
  browser: true,
  rhino: false,
  devel: false,
  loopfunc: true,
  asi: false,
  boss: false,
  couch: false,
  curly: true,
  noarg: true,
  node: true,
  noempty: true,
  nonew: true,
  expr: true
};
