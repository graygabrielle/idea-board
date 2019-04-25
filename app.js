const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const passport = require("passport");

const app = express();

//load ideas routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//passport config
require("./config/passport")(passport)

//Express-session middleware
app.use(session({
  secret:'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware (MUST BE AFTER EXPRESS SESSION MIDDLEWARE!!)
app.use(passport.initialize());
app.use(passport.session());

//Flash middleware
app.use(flash());

//global variables for flash messages
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//body parser middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//static folder
app.use(express.static(path.join(__dirname, "public")));

//method-override middleware
app.use(methodOverride('_method'));

//handlebars middleware
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Connect to mongoose
mongoose.connect("mongodb://localhost/ideaboard-dev", {
  useNewUrlParser: true
})
.then(() => console.log("MongoDB connected..."))
.catch(e => console.log(e));

//index route
app.get(`/`, (req, res) => {
  res.render('index');
});

//about route
app.get(`/about`, (req, res) => {
  res.render('about');
});

//use routes for ideas and users
app.use("/ideas", ideas);
app.use("/users", users);

//set up port and run server
const port = process.env.PORT || 5000;
app.listen(port, () =>{
  console.log(`Server started on port http://localhost:${port}`);
});