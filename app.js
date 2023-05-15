// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
var path = require ('path');
const { log } = require("console");

const app = express();
app.use(express.static(path.join(__dirname + '../public')));
// Set up EJS view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.post('/signin', (req, res) => {
  res.redirect('/dashboard');
});

app.post('/logout', (req, res) => {
  res.redirect('/');
});
  

app.post('/signup', (req, res) => {
  // TODO: Handle the sign-up logic
  // Connect to MongoDB database
  
  // Perform any signup operations here (e.g. saving user data)
  
  // Redirect the user to the signup page

  res.redirect('/signup');
});


app.post('/lopout', (req, res) => {
  // TODO: Handle the sign-up logic
  // Connect to MongoDB database
  
  // Perform any signup operations here (e.g. saving user data)
  
  // Redirect the user to the signup page

  res.redirect('/login_page');
});


app.get('/',async (req, res) => {
  res.render("login_page")

  // TODO: Validate the email and password

  // Redirect the user to the homepage 
});

app.get('/login_page',async (req, res) => {
  res.render("login_page")

  // TODO: Validate the email and password

  // Redirect the user to the homepage 
});

app.get('/dashboard', (req, res) => {
  // Render the dashboard page
  res.render('dashboard');
});
app.get('/signup', (req, res) => {
  // Render the signup page
  res.render('signup');
});

app.get('/friends', (req, res) => {
  // Render the friends page
  res.render('friends_page');
});

app.get('/logout', function(req, res) {
// Connect to MongoDB database
    // Perform any logout operations here (e.g. clearing user data)
    
    // Redirect the user to the homepage
    res.redirect("/")
  
});

  

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
