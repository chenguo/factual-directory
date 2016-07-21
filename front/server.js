var express = require('express');
var app = express();
var request = require('request');

app.use(express.static('static'))

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

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
