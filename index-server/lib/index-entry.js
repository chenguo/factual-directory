var ValidUrl = require('valid-url');

function validateId(entry) {
  if (!entry.id) {
    entry.id = entry.url
  }
  return validateString(entry, 'id');
}

function isString(s) {
  return typeof s == 'string';
}

function isNull(s) {
  return s === null || s === undefined;
}

function validateString(entry, field) {
  return isNull(entry[field]) || isString(entry[field]) ;
}

function validateNonNullString(entry, field) {
  return isString(entry[field]) && entry[field].length > 0;
}

function validateArrayOfStrings(entry, field) {
  arr = entry[field]
  if (arr instanceof Array) {
    entry[field] = arr.filter(function(s) {
      return s != null;
    });
    return entry[field].every(isString);
  } else {
    return isNull(arr);
  }
}

function validateUrl(entry, field) {
  url = entry[field]
  return ValidUrl.isHttpUri(url) || ValidUrl.isHttpsUri(url);
}

function validateTimestamp(entry, field) {
  timestamp = entry[field]
  if (typeof entry[field] != 'number') {
    entry[field] = Date.now();
  }
  return true;
}

// Validators can mutate to properly format entries
var validators = {
  id: validateId,
  url: validateUrl,
  description: validateString,
  title: validateString,
  keywords: validateArrayOfStrings,
  manual_tags: validateArrayOfStrings,
  corpus: validateString,
  timestamp: validateTimestamp,
  source: validateNonNullString,
}

function validateAndFormat(entry) {
  errs = []
  fields = ['id', 'url', 'title', 'description','keywords', 'corpus', 'manual_tags', 'timestamp', 'source'];
  fields.forEach(function(field) {
    validator = validators[field];
    if (!validator(entry, field)) {
      errs.push("Error in field " + field);
    };
  });
  return errs;
}

function formatEntry(entry) {
  errs = validateAndFormat(entry);
  if (errs && errs.length != 0) {
    entry.error = errs;
  }
  return entry
}

module.exports = {

  process: function(index, cb) {
    errors = []
    entries = []
    indexes.forEach(function(e) {
      entry = formatEntry(e);
      if (entry.error) {
        errors.push(entry);
      } else {
        entries.push(entry);
      }
    });
    cb(null, entries, errors);
  },

}
