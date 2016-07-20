module.exports = function(fn) {
  return function(req, res) {
    try {
      fn(req, res);
    } catch(err) {
      if (err instanceof Error) {
        statusCode = err.status || 500;
        res.status(statusCode).send({error: err.stack});
      } else {
        res.status(statusCode).send({error: err});
      }
    }
  }
}
