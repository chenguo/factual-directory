var async = require('async');
var safeHandler = require('../lib/safe-handler');
var IndexDb = require('../lib/index-db');
var IndexEntry = require('../lib/index-entry');

module.exports = function(app) {

  app.post('/indexes', safeHandler(function (req, res) {
    indexes = req.body
    console.log("processing " + indexes.length + " entries");
    IndexEntry.process(indexes, function(err, results, processErrs) {
      if (err) throw err;
      numProcessed = results.length
      numError = processErrs.length
      res.send({
        numProcessed: numProcessed,
        numError: numError,
        errors: processErrs
      })
    });
  }));

};
