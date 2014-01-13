var Parser = require("less").Parser,
Promise = require("bluebird");

module.exports = function(options) {
  var parser = new Parser(options);
  Promise.promisifyAll(parser);

  function lessp(input) {
    return input.asBuffer().then(function(b) {
      var d = Promise.defer();
      parser.parse(b.toString(), d.callback);
      return d.promise;
    }).then(function(parsed) {
      return parsed.toCSS();
    });
  }

  return function(inputs) {
    return Promise.all(inputs.map(lessp)).then(function(css) { 
      return css.join(""); 
    });
  };
};

