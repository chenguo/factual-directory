function responder(res) {
  return function(err, payload, status) {
    if (err) {
      statusCode = status || err.status || 500;
      if (err instanceof Error) {
        res.status(statusCode).send({error: err.stack});
      } else {
        res.status(statusCode).send({error: err});
      }
    } else {
      statusCode = status || 200;
      res.status(statusCode).send(payload);
    }
  }
}

module.exports = function(fn) {
  return function(req, res) {
    cb = responder(res);
    try {
      fn(req, res, cb);
    } catch(err) {
      cb(err);
    }
  }
}
