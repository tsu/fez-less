var Parser = require("less").Parser,
    Promise = require("bluebird"),
    xtend = require("xtend"),
    fs = require("fs"),
    path = require("path");

module.exports = function(options) {
  var parser = new Parser(xtend({
    paths: ["."]
  }, options));

  function lessp(input) {
    return input.asBuffer().then(function(b) {
      return new Promise(function(resolve, reject) {
        parser.parse(b.toString(), function(err, tree) {
          if(err) reject(err);
          else resolve(tree);
        });
      });
    }).then(function(parsed) {
      return parsed.toCSS();
    });
  }

  return function less(inputs) {
    if(options.main) {
      inputs = inputs.filter(function(i) {
        return i.getFilename() === options.main;
      });
    }

    return Promise.all(inputs.map(lessp)).then(function(css) { 
      return css.join(""); 
    });
  };
};

module.exports.imports = function(file, options) {
  var parser = new Parser(xtend({ paths: [path.dirname(file)] }, options));

  return new Promise(function(resolve, reject) {
    fs.readFile(file, function(err, data) {
      if(err) reject(err);
      else parser.parse(data.toString(), function(err, tree) {
        if(err) { 
          reject(err); 
        } else {
          var result = [];
          tree.rules.forEach(function(rule) {
            if(rule.importedFilename) result.push(rule.importedFilename);
          });
          resolve(result);
        }
      });
    });
  });
};
