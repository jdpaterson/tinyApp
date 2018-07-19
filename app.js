//WEB SERVER REQUIREMENTS
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const Keygrip = require("keygrip");

const _ = require('underscore');
const {User, Url, Visit} = require("./db/schema");
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
  if (req.session.user === undefined){
    res.redirect("/login");
  }else{
    res.redirect("/urls");
  }
})

app.get("/login", (req, res) => {
  if (req.session.user === undefined){
    res.render("login");
  }else{
    res.redirect("/urls");
  }
})

//View URLs page
app.get("/urls", (req, res) => {
  if (req.session.user === undefined){
    console.log("REQ SESSION USER UNDEFINED");
    res.status(404).redirect('/login');
  }else{
    console.log("REQ SESSION USER DEFINED");
    help.getUserUrls(req.session.user).then((urls) => {
      res.render("urls_read", {
        urls: urls,
        user: req.session.user
      })
    })
  }
})

//Login user
app.post("/login", (req, res) => {
  help.getUserByEmail(req.body.userEmail)
  .then((user) => {
    if (!user){
      res.status(404).render('login', {
        error:'You are not yet a user, please register'
      })
    }else if(!help.passwordMatches(user, req.body.password)){
      res.status(404).render('login',{
        error: `The username/password combination you entered does
        not match our records`
      })
      return;
    }else{
      req.session.user = user;
      res.redirect('/urls');
    }
  })
})

//Logout User
app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.redirect('/');
})

app.get("/register", (req, res) => {
  res.render('register');
});

app.get("/login", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.session, visitsDB);
  res.render('login', templateVars);
});

//Register new user
app.post("/register", (req, res) => {
  const newUserId = help.genRandomStr();
  if (help.isEmptyString(req.body.email) ||
      help.isEmptyString(req.body.password)
    ){
    res.status(404).render('register', {error: 'Ensure all fields are populated.'});
  }else{
    help.getUserByEmail(req.body.email).then((user) => {
      if (user){
        res.status(404).render('register',{
          error: 'Email already exists, login or choose a different email.'
        });
      }else{
        User.create({
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
        }).then((user) => {
          console.log('MY USER: ', user);
          req.session.user = user;
          res.redirect('/urls');
        })
      }
    })
  }
})

/*
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
    const url = help.getUrlByShort(req.params.id, urlDatabase)[req.params.id];

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

//POST Methods

//Add new URL
app.post("/urls", (req, res) => {
  const newUrl = help.genNewUrl(req, visitsDB);
  urlDatabase[newUrl.id] = newUrl;
  res.redirect('/urls');
});

//Update existing URL
app.put("/urls/:id", (req, res) => {
  const updatedUrl = help.genNewUrl(req, visitsDB);
  updatedUrl.longUrl = req.body.newURL;

  urlDatabase[req.params.id] = updatedUrl;
  res.redirect('/');
});

//Delete existing URL
app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

*/

//Start Server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
