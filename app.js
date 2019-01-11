/*****************************************
******************************************
*****Blog application with node js********
********29 Jan 2018***********************
********Sunil Singh***********************
******************************************
******************************************
*/
// Load module
var express = require('express');
const fileUpload = require('express-fileupload')
// Create  express object to access all the functions from Express
var app = express();
// added file upload with express
app.use(fileUpload());
var session = require('express-session');

// Set Template for UI and all files will comes from view folder
app.set('view engine', 'ejs');


// Set assets folder for js and css
//app.use('/assets',express.static('assets'));
app.use(express.static(__dirname + '/assets'));

// body parser for handling post data
var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var sess = {
    secret:"$P$BL0b26Llk9vSW7EqmVkSUQOYlYNuXh0",
    cookie: {},
    saveUninitialized: false,
    resave: false
} 
app.use(session(sess)); 
const static = require('./routes/static');
var expressValidator = require('express-validator'); //Declare Express-Validator
app.use(expressValidator());
const process = require('./routes/process');

app.get('/',static.setHome);

// Render login page
app.get('/login',static.setLogin);

// Render registration page
app.get('/registration',static.setRegistration); 

//Get Registration form data
app.post('/registration', urlencodedParser,process.Registration);
// Dashboard
app.get('/dashboard',process.Dashboard);
// Delete user's Data
app.get('/dashboard/:user_id',process.DelUser);
// show user profile
app.get('/userprofile', process.userProfile);
// update user profile with session
app.post('/userProfile', urlencodedParser,process.updateProfile); 
// show user profile
app.post('/userProfile/:user_id', urlencodedParser,process.updateProfile); 
// show user profile
app.get('/userprofile/:user_id', process.userProfile);
// Login system handler
app.post('/login', urlencodedParser, process.Login);
// Forgot password
app.get('/forgotpass',static.setForgotPassword);
// Logout endpoint
app.get('/userblogs',process.userBlog);
// Logout endpoint
app.get('/addblogs',process.addBlog);
// Logout endpoint
app.post('/addblogs',process.postBlog);

// Logout endpoint
app.get('/logout',static.setLogout);
// app
app.get('/blog',process.showblogs);
//create server
app.listen(2222);

console.log("Server running on 2222");