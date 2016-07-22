var config = require('../config.json')
var pg = require('pg');
var _ = require('lodash');

var CONN_FIELDS = ['user', 'database', 'password', 'port', 'host', 'ssl', 'application_name'];
var CONN_CFG = _.pick(config.dbConfig, CONN_FIELDS);

var TABLE = config.dbConfig.indexTable;
var INSERT_FIELDS = ['id', 'url', 'title', 'description', 'keywords', 'corpus', 'manual_tags', 'timestamp', 'source'];
var INSERT_QUERY = "INSERT INTO " + TABLE + " (" + INSERT_FIELDS.join(",") + ") VALUES";
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

function makeQuery(indexes) {
  values = [];
  valueVars = [];
  indexes.forEach(function(index, i) {
    rowVars = [];
    INSERT_FIELDS.forEach(function(field) {
      value = formatInsertValue(index, field);
      values.push(value);
      if (field == 'timestamp') {
        rowVars.push('to_timestamp($' + values.length + ')');
      } else {
        rowVars.push('$' + values.length);
      }
    });
    valueVars.push('(' + rowVars.join(',') + ')');
  });
  q = INSERT_QUERY + " " + valueVars.join(', ');
  return {
    q: q,
    values: values
  };
}

function makeDeleteSourceQuery(source) {
  return {
    q: DELETE_SRC_QUERY,
    values: [source]
  }
}

module.exports = {

  writeDB: function(indexes, cb) {
    query = makeQuery(indexes);
    pg.connect(CONN_CFG, function(err, client, done) {
      if (err) return cb(err);
      client.query(query.q, query.values, function(err, result) {
        done();
        cb(err, result);
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
