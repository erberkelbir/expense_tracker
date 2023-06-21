
// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
var path = require ('path');
const { log } = require("console");
const items = [
  {
    friend_username: 'John',
    cat_id: 1,
    money: 100,
    date: '01-01-2022',
    description: 'Grocery shopping',
  },
  {
    friend_username: 'Maria',
    cat_id: 3,
    money: 500,
    date: '01-01-2022',
    description: 'Grocery shopping',
  },
  {
    friend_username: 'John',
    cat_id: 1,
    money: 100,
    date: '01-01-2022',
    description: 'Grocery shopping',
  },
  {
    friend_username: 'John',
    cat_id: 1,
    money: 100,
    date: '01-01-2022',
    description: 'Grocery shopping',
  },
  // ... more items
];
const app = express();
app.use(express.static(path.join(__dirname + '../public')));
// Set up EJS view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.post('/signin', (req, res) => {
  console.log(req.body)
  res.redirect('/dashboard');
});

app.post('/logout', (req, res) => {
  res.redirect('/');
});

app.post('/add_expense', (req, res) => {
  console.log(req.body)
  res.redirect('/dashboard');
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

app.get('/signup',async (req, res) => {
  res.render("signup_page")

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

app.get('/show_profile', (req, res) => {
  console.log(req.query); // This will log "erberk1"
});

app.get('/friends', (req, res) => {
  // Render the friends page
  res.render('friends_page' , {items: items});
});

app.get('/settings', (req, res) => {
  // Render the friends page
  res.render('settings_page');
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




