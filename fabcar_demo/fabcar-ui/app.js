
// Fabcar commandline client for enrolling and Admin
var enrollAdmin = require("./handlers/enrollAdmin");
var registerUser = require("./handlers/registerUser");
var invoke = require("./handlers/invoke");
var query = require("./handlers/query");
var api = require("./handlers/api");

/////////////////////////////////////////
// Express setup
var express = require("express");
var app = express();
app.set("views", "./views");
app.use(express.static("public"));

/////////////////////////////////////////
// VIEWS
app.get('/', function (req, res){
    res.render("index.jade")
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
app.get('/query', function (req, res){
    res.render("query.jade")
});
app.get('/api', function (req, res){
    res.render("api.jade")
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
app.get('/actionApi', function (req, res){
    var promiseApi = api.callApi();
    //var promiseApi = api.log();
    var promiseValue = async () => {
        const value = await promiseApi;
        console.log(value);
        res.render("api.jade", {data: value});
    };
    promiseValue();
});


app.listen(3000,function (){
    console.log('fabcar-ui listening on port 3000');
});

