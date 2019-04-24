const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

//map global promise-get rid of warning
// mongoose.Promise = global.Promise;

//body parser middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Connect to mongoose
mongoose.connect("mongodb://localhost/ideaboard-dev", {
  useNewUrlParser: true
})
.then(() => console.log("MongoDB connected..."))
.catch(e => console.log(e));

//load Idea model
require("./models/Idea");
const Idea = mongoose.model('ideas');

//index route
app.get(`/`, (req, res) => {
  const title = 'welcome';
  res.render('index', {title});
});

//about route
app.get(`/about`, (req, res) => {
  res.render('about');
});

//add Idea form
app.get(`/ideas/add`, (req, res) => {
  res.render('ideas/add');
});

//process form
app.post(`/ideas`, (req, res) =>{
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length>0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else{
    res.send('passed');
  }

});

//handlebars middleware
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//set up port and run server
const port = process.env.PORT || 5000;
app.listen(port, () =>{
  console.log(`Server started on port http://localhost:${port}`);
});