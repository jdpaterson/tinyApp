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
    res.status(404).redirect('/login');
  }else{
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
          req.session.user = user;
          res.redirect('/urls');
        })
      }
    })
  }
})

//Add a new URL page
app.get("/urls/new", (req, res) => {
  if (req.session.user === undefined){
    res.status(404).render('login', {
      error:'You are not logged in, please register or login'
    })
  }else{
    res.render("urls_new", {
      user: req.session.user
    })
  }
})

//Update a URL page
app.get("/urls/:id", (req, res) => {
  if (!req.session.user){
    res.status(404).render('login', {
      error:'You are not logged in, please register or login'
    });
  }else{
    Url.findById(req.params.id).then((url) => {
      if (!url){
        res.status(404).render('urls_read',{error:'We can\'t find an Id matching that value.'});
      }else{
        if(url.owner_id === req.session.user.id){
          res.render('url_edit', {
            urlToEdit: url,
            user: req.session.user
          })
        }else{
          res.status(404).send
          ('You do not own that key');
        }
      }
    })
  }
})

//Redirect to short URL
app.get("/u/:shortUrl", (req, res) => {
  if (req.session.visitor_id === undefined){
    req.session.visitor_id = help.genRandomStr();
  }
  help.addVisit(req.params.id, req.session.visitor_id).then((vis) => {
    Url.find({
      where: {
        short_url: req.params.shortUrl
      }
    }).then((url) => {
      res.redirect(url.long_url);
    })
  })
});

//POST Methods

//Add new URL
app.post("/urls", (req, res) => {
  help.insUrl(req).then((url) => {
    res.redirect('/urls');
  })
})

//Update existing URL
app.post("/urls/:id", (req, res) => {
  help.updUrl(req).then((resp) => {
    res.redirect('/');
  })
})

//Delete existing URL
app.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

//Start Server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})
