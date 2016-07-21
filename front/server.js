var express = require('express');
var bodyParser = require('body-parser')
var request = require('request');
var app = express();

app.use(express.static('static'))
app.use(bodyParser.json());
// app.use(express.json());

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/views/home.html");
})

app.get('/search', function(req, res) {
  qstr = req.query.qstr;
  reqParams = {qstr: qstr};
  request({url: 'http://10.20.10.146:4000/search', qs:reqParams}, function(err, resp, body) {
    res.send(body);
  })
})

app.post('/feedback', function(req, res) {
  console.log(req.body)
  request.post({
    url: 'http://10.20.10.146:4000/search/feedback',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  }, function(err, resp, body) {
    console.log("posted got", resp.statusCode)
  })
  console.log('would technically submit feedback')
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
