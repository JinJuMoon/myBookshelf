var bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express();

var passport = require("passport"),
    LocalStrategy = require("passport-local")

var Book = require("./models/book");
var User = require("./models/user");

// passport configuration
app.use(require("express-session")({
    secret: "mozzi is so cute and best!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(function(req, res, next){
//   res.locals.currentUser = req.user;
//   next();
// });



// //sample data
// var book1 = [{
//   title: "내 마음을 읽는 시간",
//   author: "moonui",
//   image: "http://t1.daumcdn.net/liveboard/gilbut/e5594b51aeeb40b180b6bf2e829f5fb7.jpg",
//   review: "매우 좋았다"
// },
// {
//   title: "내 마음을 읽는 시간",
//   author: "moonui",
//   image: "http://t1.daumcdn.net/liveboard/gilbut/e5594b51aeeb40b180b6bf2e829f5fb7.jpg",
//   review: "매우 좋았다"
// }]
//
// Book.create(book1, function(err, book1){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(book1);
//   }
// })



mongoose.connect("mongodb://localhost:27017/mybookshelf", {useNewUrlParser: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get("/", function(req,res){
  res.render('home');
});



app.get('/about', function(req,res){
  res.render('about');
});

// index page
app.get('/bookshelf', function(req,res){
  Book.find({}, function(err, books){
    if(err){
      console.log(err);
    } else {
    res.render("bookshelf/index", {books: books});
    }
  })
});

// create page
app.post("/bookshelf", function(req,res){
  var title = req.body.title;
  var author = req.body.author;
  var image = req.body.image;
  var review = req.body.review;
  var newBook = {title: title, author: author, image: image, review: review}
  Book.create(newBook, function(err, createdBook){
    if(err){
      console.log(err);
    } else {
      res.redirect("/bookshelf");
    }
  })
});

// new page
app.get("/bookshelf/new", function(req,res){
  res.render("bookshelf/new");
});

// show page
app.get("/bookshelf/:id", function(req,res){
  Book.findById(req.params.id).exec(function(err, foundBook){
    if(err){
      console.log(err);
    } else {
      res.render("bookshelf/show", {book: foundBook});
    }
  });
})



// register page
app.get("/register", function(req,res){
  res.render("register");
});
// register logic
app.post("/register", function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/bookshelf");
    });
  });
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
