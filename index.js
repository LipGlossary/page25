var express = require('express');
var app     = express();
var data    = require('./data.json');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.redirect('/10');
});

app.get(/\d\d/, function (req, res) {
  var index = req.url.substring(1);
  if (data[index]) {
    var locals =
      { index: index
      , image: '/images/' + index + '.png'
      , text : data[index]
      };
    if(req.headers.accept.includes('application/json')) {
      res.json(locals);
    } else {
      res.render('pages/index', locals);
    }
  } else {
    res.status(204).json({});
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


