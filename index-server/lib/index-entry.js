var ValidUrl = require('valid-url');

function validateId(entry) {
  if (!entry.id) {
    entry.id = entry.url
  }
  return valideString(entry, 'id');
}

function isString(s) {
  return typeof s == 'string';
}

function validateString(entry, field) {
  return isString(entry[field]);
}

function isArrayOfStrings(entry, field) {
  arr = entry[field]
  if (arr instanceof Array) {
    entry[field] = arr.filter(function(s) {
      return s != null;
    });
    return entry[field].every(isString);
  } else {
    return false;
  }
}

function validateUrl(url) {
  return ValidUrl.isHttpUri(url) || ValidUrl.isHttpsUri(url);
}

// Validators can mutate to properly format entries
var validators = {
  id: isString,
  url: validateUrl,
  keywords: isArrayOfStrings,
  manual_tags: isArrayOfStrings,
  corpus: isString,
  description: isString
}

function validateAndFormat(entry) {
  errs = []
  fields = ['id', 'url', 'keywords', 'corpus', 'description', 'manual_tags'];
  fields.forEach(function(field) {
    validator = validators[field];
    validator(entry, field);
  });
  if (!validateUrl(entry.url)) {
    errs.push("Invalid URL");
  }
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
