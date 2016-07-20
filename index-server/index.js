var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json({limit: '100mb'}));

app.get('/', function (req, res) {
  res.send('Factual Directory Index API server');
});

require('./routes')(app);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
