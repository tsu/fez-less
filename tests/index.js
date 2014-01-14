var t = require('tape');
var Promise = require('bluebird');
var fezless = require('../src/main');

t.test('builder', function(t) {
  fezless()([{
    asBuffer: function() { return Promise.cast(new Buffer("#main { a { color:#fff } }", 'utf8')) },
  },{
    asBuffer: function() { return Promise.cast(new Buffer("a { color:#ddd }", 'utf8')) },
  }]).then(function(output) {
    t.equals(output, '#main a {\n  color: #ffffff;\n}\na {\n  color: #dddddd;\n}\n');
    t.end();
  });
});

