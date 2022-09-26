//login

var express = require("express");
var app = express();
const ejs = require('ejs');
const path = require('path');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const MongoDBURI = process.env.MONGO_URI || 'mongodb://localhost/ManualAuth';



mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

app.use(express.static(__dirname + '/public'));

const index = require('./routes/index');
app.use('/', index);

/////////////////////////////////////////
// VIEWS
app.get('/', function (req, res){
    res.render("index1.jade")
});

app.get('/enroll', function (req, res){
    res.render("enroll.jade")
});
app.get('/register', function (req, res){
    res.render("register.jade")
});
app.get('/invoke', function (req, res){
    res.render("invoke.jade")
});
app.get('/display', function (req, res){
    res.render("display.ejs")
});
app.get('/query', function (req, res){
    res.render("query.jade")
});
app.get('/scopeup', function (req, res){
    res.render("update.jade")
});

app.get('/test', function (req, res){
    res.render("test.jade", {title: "TEST"})
});

/////////////////////////////////////////
// ACTIONS
app.get('/actionEnrollAdmin', function (req, res){
    //var promiseEnrollAdmin = enrollAdmin.log();
    var promiseEnrollAdmin = enrollAdmin.enroll();
    var promiseValue = async () => {
        const value = await promiseEnrollAdmin;
        console.log(value);
        res.render("enroll.jade", {data: value});
    };
    promiseValue();
});
app.get('/actionRegisterUser', function (req, res){
    //var promiseRegisterUser = registerUser.log();
    var promiseRegisterUser = registerUser.register();
    var promiseValue = async () => {
        const value = await promiseRegisterUser;
        console.log(value);
        res.render("register.jade", {data: value});
    };
    promiseValue();
});
app.get('/actionInvoke', function (req, res){
    //ar promiseInvoke = invoke.log();
    var promiseInvoke = invoke.invokeTransaction();
    var promiseValue = async () => {
        const value = await promiseInvoke;
        console.log(value);
        res.render("invoke.jade", {data: value});
    };
    promiseValue();
});
app.get('/actionQuery', function (req, res){
    //var promiseQuery = query.log();
    var promiseQuery = query.queryTransaction();
    var promiseValue = async () => {
        const value = await promiseQuery;
        console.log(value);
        res.render("query.jade", {data: value});
    };
    promiseValue();
});
app.get('/update_c', function (req, res){
    var promiseUpscope = updatescope.updatesc();
    //var promiseApi = api.log();
    var promiseValue = async () => {
        const value = await promiseUpscope;
        console.log(value);
        res.render("query.jade", {data: value});
    };
    promiseValue();
});



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});





// Fabcar commandline client for enrolling and Admin
var enrollAdmin = require("./handlers/enrollAdmin");
var registerUser = require("./handlers/registerUser");
var invoke = require("./handlers/invoke");
var query = require("./handlers/query");
var updatescope = require("./handlers/updatescope");

/////////////////////////////////////////
// Express setup

app.set("views", "./views");
app.use(express.static("public"));
 



app.listen(3000,function (){
    console.log('fabcar-ui listening on http://localhost:3000');
});


