var Parser = less = require("less").Parser,
    Promise = require("bluebird");

module.exports = function(options) {
  var parser = new Parser(options);

  function lessp(p) {
    return p.then(function(input){ 
      return new Promise(function(resolve, reject) {
	parser.parse(input.toString(), function (err, tree) { 
	  if(err) reject(err); 
	  else resolve(tree.toCSS()); 
	});
      });
    });
  };

  return function(inputs) {
    return Promise.all(inputs.map(function(input) { return input.asBuffer(); }).map(lessp)).then(function(css) { return css.join(""); });
  };
};

