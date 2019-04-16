var express = require('express'),
    app     = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
  res.render('home');
});

app.get('/about', function(req,res){
  res.render('about');
});

app.get('/bookshelf', function(req,res){
  res.render('bookshelf/index');
});

// 커스텀 404 페이지
app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

// 커스텀 500 페이지
app.use(function(req,res){
  console.error(err.stack);
  res.type('text/palin');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(4000, function(){
  console.log("The server is running!");
});
