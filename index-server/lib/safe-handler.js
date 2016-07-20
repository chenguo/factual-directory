module.exports = function(fn) {
  return function(req, res) {
    try {
      fn(req, res);
    } catch(err) {
      if (err instanceof Error) {
        res.json({error: err.stack});
      } else {
        res.json({error: err});
      }
    }
  }
}
