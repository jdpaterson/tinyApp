const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
//const bcrypt = require('bcryptjs');
const Keygrip = require("keygrip");
const methodOverride = require("method-override");
const _ = require('underscore');
const urlDatabase = require("./data.js").urlDatabase;
const visitsDB = require("./data.js").visitsDB;
const userList = require("./data.js").userList;
const help = require("./help.js");

const PORT = 8080;

const keys = new Keygrip(["SEKRIT2", "SEKRIT1"]);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: keys,
  maxAge: 24 * 60 * 60 * 1000 * 365,
}));
app.use(methodOverride('_method'));

//GET Methods

//Home page
app.get("/", (req, res) => {
  if (req.session.user_id === undefined){
    res.redirect("/login");
  }else{
    res.redirect("/urls");
  }
});

//View URLs page
app.get("/urls", (req, res) => {
  if (req.session.visitor_id === undefined){
    req.session.visitor_id = help.genRandomStr();
  }
  if (req.session.user_id === undefined){
    res.status(404).render('login', {
      error:'You are not logged in, please register or login'
    });
  }else{
    const templateVars = help.setTemplateVars(urlDatabase, userList, req.session, visitsDB);
    res.render("urls_read", templateVars);
  }
});

//Add a new URL page
app.get("/urls/new", (req, res) => {
  if (req.session.user_id === undefined){
    res.status(404).render('login', {error:'You are not logged in, please register or login'});
  }else{
    const templateVars = help.setTemplateVars(urlDatabase, userList, req.session, visitsDB);
    res.render("urls_new", templateVars);
  }
});

//Update a URL page
app.get("/urls/:id", (req, res) => {
  if (req.session.user_id === undefined){
    res.status(404).render('login', {
      error:'You are not logged in, please register or login'
    });
  }else{
    const url = help.getUrlByShort(req.params.id, urlDatabase);
    if (url.id === undefined){
      res.status(404).render('urls_read',{error:'We can\'t find an Id matching that value.'});
    }else{
      if(url.ownerId === req.session.user_id){
        const templateVars = help.setTemplateVars(urlDatabase, userList, req.session, visitsDB);
        templateVars.urlToEdit = url;
        res.render('url_edit', templateVars);
      }else{
        res.status(404).send
        ('You do not own that key');
      }
    }
  }
});

//Redirect to short URL
app.get("/u/:shortUrl", (req, res) => {

  const url = urlDatabase[req.params['shortUrl']];

  if (req.session.visitor_id === undefined){
    req.session.visitor_id = help.genRandomStr();
  }

  help.addVisit(url, req.session.visitor_id, visitsDB);
  res.redirect(url.longUrl);
});

app.get("/register", (req, res) => {
  res.render('register');
});

app.get("/login", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.session, visitsDB);
  res.render('login', templateVars);
});

//POST Methods

//Add new URL
app.post("/urls", (req, res) => {
  const newUrl = help.genNewUrl(req, visitsDB);
  urlDatabase[newUrl.id] = newUrl;
  res.redirect('/urls');
});

//Update existing URL
app.put("/urls/:id", (req, res) => {
  const updatedUrl = {
    id: req.params.id,
    longUrl: req.body.newURL,
    ownerId: req.session["user_id"],
  };
  urlDatabase[req.params.id] = updatedUrl;
  res.redirect('/');
});

//Delete existing URL
app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

//Login user
app.post("/login", (req, res) => {
  const user = help.getUserByEmail(req.body.userEmail, userList);
  if (!user){
    res.status(404).render('login', {error:'You are not yet a user, please register'});
  }else if(!help.passwordMatches(req.body.userEmail, req.body.password, userList)){
    res.status(404).render('login',
      {error: 'The username/password combination you entered does not match our records'}
    );
    return;
  }
  req.session.user_id = user.id;
  res.redirect('/');

});

//Logout User
app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.redirect('/urls');
});

//Register new user
app.post("/register", (req, res) => {
  const newUserId = help.genRandomStr();
  if (help.isEmptyString(req.body.email) ||
      help.isEmptyString(req.body.password)
    ){
    res.status(404).render('register', {error: 'Ensure all fields are populated.'});
  }else if (help.getUserByEmail(req.body.email, userList) !== null){
    res.status(404).render('register',
    {error: 'Email already exists, login or choose a different email.'});
  }else{
    const newUser = {
      id: newUserId,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };

    userList[newUserId] = newUser;
    req.session.user_id = newUser.id;
    res.redirect('/urls');
  }
})

//Start Server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
