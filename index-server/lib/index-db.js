var async = require('async');
var config = require('../config.json')
var pg = require('pg');
var _ = require('lodash');

var CONN_FIELDS = ['user', 'database', 'password', 'port', 'host', 'ssl', 'application_name'];
var CONN_CFG = _.pick(config.dbConfig, CONN_FIELDS);

var TABLE = config.dbConfig.indexTable;
var INSERT_FIELDS = ['id', 'url', 'title', 'description', 'keywords', 'corpus', 'manual_tags', 'timestamp', 'source'];
var INSERT_QUERY = "INSERT INTO " + TABLE + " (" + INSERT_FIELDS.join(',') + ") VALUES"
var SELECT_QUERY = "SELECT id FROM " + TABLE + " WHERE id = ($1)";
var DELETE_SRC_QUERY = "DELETE FROM " + TABLE + " WHERE source = ($1)";

console.log(CONN_CFG);

function arrayValueFormatter(arr) {
  if (arr) {
    return "{" + arr.join(',') + "}";
  } else {
    return "{}";
  }
}

var formatters = {
  "keywords": arrayValueFormatter,
  "manual_tags": arrayValueFormatter
}

function formatInsertValue(indexEntry, field) {
  value = indexEntry[field]
  formatter = formatters[field];
  if (formatter) {
    value = formatter(value);
  } else if (value) {
    value = value.toString();
  } else {
    value = ''
  }
  return value;
}

function makeFindRowQuery(index) {
  return {
    q: SELECT_QUERY,
    values: [index.id]
  }
}

function makeInsertQuery(index) {
  vars = [];
  values = [];
  INSERT_FIELDS.forEach(function(field) {
    value = formatInsertValue(index, field);
    values.push(value);
    if (field == 'timestamp') {
      vars.push('to_timestamp($' + values.length + ')');
    } else {
      vars.push('$' + values.length);
    }
  });
  q = INSERT_QUERY + ' (' + vars.join(',') + ')';
  return {
    q: q,
    values: values
  }
}

function makeUpdateQuery(index) {
  setVars = [];
  values = [];
  INSERT_FIELDS.forEach(function(field) {
    value = formatInsertValue(index, field);
    values.push(value);
    if (field == 'timestamp') {
      setVars.push(field + ' = to_timestamp($' + values.length + ')');
    } else {
      setVars.push(field + ' = $' + values.length);
    }
  });
  idVar = '$' + (values.length + 1);
  values.push(index.id)
  q = "UPDATE " + TABLE + " SET " + setVars.join(',')  + " WHERE id = " + idVar
  return {
    q: q,
    values: values
  }
}

function makeDeleteSourceQuery(source) {
  return {
    q: DELETE_SRC_QUERY,
    values: [source]
  }
}

function findRow(client, row, cb) {
  query = makeFindRowQuery(row);
  client.query(query.q, query.values, cb);
}

function updateRow(client, row, cb) {
  query = makeUpdateQuery(row)
  client.query(query.q, query.values, function(err, results) {
    cb(err);
  });
}

function insertRow(client, row, cb) {
  query = makeInsertQuery(row)
  client.query(query.q, query.values, function(err, results) {
    cb(err);
  });
}

function upsertRows(client, indexes, cb) {
  async.mapLimit(indexes, 50, function(row, callback) {
    findRow(client, row, function(err, result) {
      if (err) return callback(err);
      if (result.rowCount > 0) {
        updateRow(client, row, callback);
      } else {
        insertRow(client, row, callback);
      }
    });
  }, cb);
}

module.exports = {

  writeDB: function(indexes, cb) {
    pg.connect(CONN_CFG, function(err, client, done) {
      if (err) return cb(err);
      upsertRows(client, indexes, function(err, results) {
        done();
        cb(err, results);
      });
    });
  },

  deleteBySource: function(source, cb) {
    query = makeDeleteSourceQuery(source);
    pg.connect(CONN_CFG, function(err, client, done) {
      if (err) return cb(err);
      client.query(query.q, query.values, function(er, result) {
        done();
        cb(err, result);
      });
    });
  }

}
