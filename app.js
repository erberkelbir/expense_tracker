const apiRequest = require('./api');
var token;
var id;
var username;
var friends_name;
const request_dict = {
  'loginUser' : ['http://localhost:8080/auth/login', 'POST'], //okay
  'registerUser' : ['http://localhost:8080/auth/register', 'POST'], //okay
  'createExpense' : ['http://localhost:8080/expense', 'POST'], //okay
  'getAllExpense' : ['http://localhost:8080/expense', 'GET'], //okay
  'acceptFriendshipRequest' : ['http://localhost:8080/friendship/accept-request/', 'POST'], //okay
  'deleteExpense' : ['http://localhost:8080/expense/', 'DELETE'], //okay
  'getExpenseCategoriesTotal' : ['http://localhost:8080/expense/categories-total', 'GET'], 
  'getFriendshipExpenses' : ['http://localhost:8080/friendship/expenses', 'GET'], //okay
  'rejectFriendshipRequest' : ['http://localhost:8080/friendship/reject-request/', 'POST'], //okay
  'removeFriendship' : ['http://localhost:8080/friendship/remove/', 'POST'], //okay
  'getFriendshipRequests' : ['http://localhost:8080/friendship/requests', 'GET'], //okay
  'sendFriendshipRequest' : ['http://localhost:8080/friendship/send-request/', 'POST'], //okay
  'getAllFriends' : ['http://localhost:8080/friendship/all', 'GET'], //okay
  'getUser' : ['http://localhost:8080/user', 'GET'],
  'getUserById' : ['http://localhost:8080/user/', 'GET'],
  'getUserExpenses' : ['http://localhost:8080/user/expenses', 'GET'],
  'updateUserName': ['http://localhost:8080/user/update-username', 'PUT'],
  'resetPassword': ['http://localhost:8080/auth/reset-password', 'PUT'],
  'getFriendshipExpensesByCategory': ['http://localhost:8080/friendship/categories-total/', 'GET'],
  'getFriendshipExpensesAll': ['http://localhost:8080/friendship/all-expenses/', 'GET'],
  'getBudget': ['http://localhost:8080/user/get-budget', 'GET'],
  'setBudget': ['http://localhost:8080/user/set-budget?budget=', 'PUT'],
}

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


app.post('/signin', async (req, res) => {
  const data = {"userName": req.body.username, "password": req.body.password};
  const resp = await apiRequest(request_dict['loginUser'][0], request_dict['loginUser'][1], data);
  if (resp){
    token = resp.token;
    id = resp.id;
    username = req.body.username;
    res.redirect('/dashboard');
  }
  else{
    res.redirect('/');
  }
});

app.post('/logout', (req, res) => {
  res.redirect('/');
});

app.post('/add_expense', async (req, res) => {
  const data = {
    "amount": req.body.amount,
    "description": req.body.description,
    "expenseType": req.body.category,
  }
  const resp = await apiRequest(request_dict['createExpense'][0], request_dict['createExpense'][1], data, token);
  res.redirect('/dashboard');
});
  

app.post('/signup', async (req, res) => {
  const data = {
    "password": req.body.password[0],
    "rewritePassword": req.body.password[1],
    "userName": req.body.username,
  }
  const resp = await apiRequest(request_dict['registerUser'][0], request_dict['registerUser'][1], data);
  if(resp){
    console.log('redirecting to login page');
    res.redirect('/login_page');
  }
  else{
    console.log('redirecting to signup page');
    res.redirect('/signup');
  }
});


app.post('/lopout', (req, res) => {
  token = undefined;
  // Redirect the user to the signup page

  res.redirect('/login_page');
});


app.get('/',async (req, res) => {
  res.render("login_page");

  // Redirect the user to the homepage 
});

app.get('/signup',async (req, res) => {
  //console.log(req);
  res.render("signup_page");

  // Redirect the user to the homepage 
});


app.get('/login_page',async (req, res) => {
  res.render("login_page")

  // Redirect the user to the homepage 
});

app.get('/dashboard', async (req, res) => {
  const resp = await apiRequest(request_dict['getAllExpense'][0], request_dict['getAllExpense'][1], {}, token);
  var item_list = [];
  for (var i = resp.length-1; i >= 0; i--) {
    item_list.push({
      category: resp[i].expenseType.charAt(0).toUpperCase() + resp[i].expenseType.slice(1),
      money: resp[i].amount,
      date: resp[i].created.split('T')[0],
      description: resp[i].description,

    });
  }
  var category_list = await getExpenseCategoriesTotal();
  //res.render('expenses_page', {items: item_list});
  // Render the dashboard page
  var budget = await getBudget();
  res.render('dashboard', {items: item_list, categories: category_list, Budget: budget, Username: username});
});

app.get('/signup', (req, res) => {
  console.log(req); // This will log "erberk1"
  // Render the signup page
  res.render('signup');
});

app.get('/show_profile', (req, res) => {
  friends_name = req.query.friendname;
  res.redirect('/friend_dashboard');
});
app.get('/friend_dashboard', async (req, res) => {
  const resp = await apiRequest(request_dict['getFriendshipExpensesAll'][0]+friends_name, request_dict['getFriendshipExpensesAll'][1], {}, token);
  item_list = [];
  console.log(friends_name)
  for (var i = resp.length-1; i >= 0; i--) {
    item_list.push({
      category: resp[i].expenseType.charAt(0).toUpperCase() + resp[i].expenseType.slice(1),
      money: resp[i].amount,
      date: resp[i].created.split('T')[0],
      description: resp[i].description,

    });
  }
  category_list = await getFriendsExpenseCategoriesTotal();
  var budget = await getBudget();
  // Render the friend dashboard page
  res.render('friend_dashboard', {items: item_list, categories: category_list, Budget: budget, Username: username, friend_name:friends_name});
});

app.get('/friends', async (req, res) => {
  // Render the friends page
  const resp = await apiRequest(request_dict['getFriendshipExpenses'][0], request_dict['getFriendshipExpenses'][1], {}, token);
  var item_list = [];
  for (var i = 0; i < resp.length; i++) {
    item_list.push({
      friend_username: resp[i].username,
      cat_id: resp[i].expenseType,
      money: resp[i].amount,
      date: resp[i].created.split('T')[0],
      description: resp[i].description,
    });
  };
  const friend_list= await getAllFriends()
  const request_list = await getFriendshipRequests()
  var budget = await getBudget();
  res.render('friends_page' , {items: item_list, friends: friend_list, Requests: request_list, Budget: budget, Username: username});
});

app.get('/settings', async (req, res) => {
  // Render the friends page
  var budget = await getBudget();
  res.render('settings_page' , {Budget: budget, Username: username});
});


app.get('/logout', function(req, res) {
// Connect to MongoDB database
    // Perform any logout operations here (e.g. clearing user data)
    // Redirect the user to the homepage
    res.redirect("/")
  
});

/// Friends page
app.post('/add_friend', async (req, res) => {
  console.log(req.body.username);
  const resp = await apiRequest(request_dict['sendFriendshipRequest'][0]+req.body.username, request_dict['sendFriendshipRequest'][1], {}, token);
  res.redirect('/friends');
});

app.post('/accept_friend', async (req, res) => {
  console.log(req.body);
  const resp = await apiRequest(request_dict['acceptFriendshipRequest'][0]+req.body.friendname, request_dict['acceptFriendshipRequest'][1], {}, token);
  res.redirect('/friends');
});

app.post('/reject_friend', async (req, res) => {
  const resp = await apiRequest(request_dict['rejectFriendshipRequest'][0]+req.body.friendname, request_dict['rejectFriendshipRequest'][1], {}, token);
  res.redirect('/friends');
});

app.post('/delete_friend', async (req, res) => {
  const data = {
    "friendUsername": req.body.friend_username,
  }
  const resp = await apiRequest(request_dict['removeFriendship'][0], request_dict['removeFriendship'][1], data, token);
  res.redirect('/friends');
});

async function getFriendshipRequests(){
  const resp = await apiRequest(request_dict['getFriendshipRequests'][0], request_dict['getFriendshipRequests'][1], {}, token);
  return resp;
};

async function getAllFriends(){
  const resp = await apiRequest(request_dict['getAllFriends'][0], request_dict['getAllFriends'][1], {}, token);
  return resp;
}

app.get('/getUserbyId', async (req, res) => {
  data = {
    "userId": req.query.userId,
  }
  const resp = await apiRequest(request_dict['getUserbyId'][0], request_dict['getUserbyId'][1], data, token);
  res.render('expenses_page', {items: resp});
});

/// Expenses page
// app.get('/dashboard', async (req, res) => {
//   const resp = await apiRequest(request_dict['getAllExpense'][0], request_dict['getAllExpense'][1], {}, token);
//   var item_list = [];
//   for (var i = 0; i < resp.length; i++) {
//     item_list.push({
//       category: resp[i].expenseType,
//       money: resp[i].amount,
//       date: resp[i].created,
//       description: resp[i].description,

//     });
//   }
//   res.render('expenses_page', {items: item_list});
// });

app.get('/delete_expense', async (req, res) => {
  const data = {
    "expenseId": req.query.expenseId,
  }
  const resp = await apiRequest(request_dict['deleteExpense'][0], request_dict['deleteExpense'][1], data, token);
  res.redirect('/all_expenses');
});


async function getExpenseCategoriesTotal(){
  var category_list = [];
  const resp_category = await apiRequest(request_dict['getExpenseCategoriesTotal'][0], request_dict['getExpenseCategoriesTotal'][1], {}, token);
  for (const key in resp_category) {
    if(resp_category[key] > 0){
      category_list.push({
        category: key.charAt(0).toUpperCase() + key.slice(1),
        money: resp_category[key]
      });
    }
  }
  return category_list;
};

async function getFriendsExpenseCategoriesTotal(){
  var category_list = [];
  const resp_category = await apiRequest(request_dict['getFriendshipExpensesByCategory'][0]+friends_name, request_dict['getFriendshipExpensesByCategory'][1], {}, token);
  for (const key in resp_category) {
    if(resp_category[key] > 0){
      category_list.push({
        category: key.charAt(0).toUpperCase() + key.slice(1),
        money: resp_category[key]
      });
    }
  }
  return category_list;
};

/// Settings page

app.post('/update_username', async (req, res) => {
  console.log(req.body.username);
  console.log(request_dict);
  const data = {
    "name": req.body.username,
  }
  const resp = await apiRequest(request_dict['updateUserName'][0], request_dict['updateUserName'][1], data, token);
  console.log("++++" , resp);
  if (resp){ 
    username = req.body.username;
  }
  res.redirect('/settings');  //TODO: bunun için settings_page'de popup açılacak ve oradan form ile alınıp buraya put ile gönderilecek
});

app.post('/update_password', async (req, res) => {
  console.log(req.body);
  const data = {
      "currentPassword": req.body.current_password,
      "newPassword": req.body.new_password,
      "rewritePassword": req.body.confirm_new_password,
    }
  const resp = await apiRequest(request_dict['resetPassword'][0], request_dict['resetPassword'][1], data, token);
  console.log(resp);
  res.redirect('/settings'); //TODO: burda şifre başarılıyla değiştirildi gibi bir popup yapıp sonra settingse yönlendirilebilir
});

async function getBudget(){
  const resp = await apiRequest(request_dict['getBudget'][0], request_dict['getBudget'][1], {}, token);
  return resp;
}

async function updateBudget(budget){
  const resp = await apiRequest(request_dict['setBudget'][0]+budget, request_dict['setBudget'][1], {}, token);
  return resp;
}

app.post('/update_budget', async (req, res) => {
  const resp = await updateBudget(req.body.budget_input);
  res.redirect('/settings');
});
// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));




