var async = require('async');
var safeHandler = require('../lib/safe-handler');
var IndexDB = require('../lib/index-db');
var IndexEntry = require('../lib/index-entry');

function makeProcessedPayload(processed, processErrs) {
  numProcessed = processed.length
  numError = processErrs.length
  return {
    numProcessed: numProcessed,
    numError: numError,
    errors: processErrs
  };
}

module.exports = function(app) {

  app.post('/indexes', safeHandler(function(req, res, cb) {
    indexes = req.body
    console.log("processing " + indexes.length + " entries");
    IndexEntry.process(indexes, function(err, results, processErrs) {
      if (err) cb(err);
      payload = makeProcessedPayload(results, processErrs);
      if (processErrs.length > 0) {
        cb(null, payload, 400);
      } else if (results.length > 0) {
        IndexDB.writeDB(entries, function(err, results) {
          if (err) return cb(err);
          else cb(null, payload);
        });
      } else {
        cb(null, payload);
      }
    });
  }));

  app.delete('/indexes/source/:source', safeHandler(function(req, res, cb) {
    if (req.params) {
      source = req.params.source;
    }
    if (source) {
      IndexDB.deleteBySource(source, function(err, results) {
        if (err) return cb(err);
        else cb(null, {deletedSource: source});
      });
    } else {
      cb(new Error("No source to delete"));
    }
  }));

};
