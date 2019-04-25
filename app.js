const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();

//map global promise-get rid of warning
// mongoose.Promise = global.Promise;

//body parser middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//method override middleware
app.use(methodOverride('_method'));

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
  res.render('index');
});

//about route
app.get(`/about`, (req, res) => {
  res.render('about');
});

//Idea index page
app.get(`/ideas`, (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas
      });
    })

})

//add Idea form
app.get(`/ideas/add`, (req, res) => {
  res.render('ideas/add');
});

//edit Idea form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      res.render('ideas/edit', {
        idea
      });
    })

})

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
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      });
  }

});

//edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      //new values
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          res.redirect('/ideas');
        })
    })
})

//delete idea
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/ideas');
    });
});


//handlebars middleware
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//set up port and run server
const port = process.env.PORT || 5000;
app.listen(port, () =>{
  console.log(`Server started on port http://localhost:${port}`);
});