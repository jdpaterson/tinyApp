const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const Keygrip = require("keygrip");
const help = require("./help.js");
const PORT = 8080;

const keys = new Keygrip(["SEKRIT2", "SEKRIT1"]);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: keys, //['string'],
}));

const urlDatabase = {
  "b2xVn2": {
    longUrl: "http://www.lighthouselabs.ca",
    ownerId: "supGuy",
  },
  "9sm5xK": {
    longUrl: "http://www.google.com",
    ownerId: "supGuy"
  },
};

const userList = {
  "supGuy": {
    id: "supGuy",
    email: "123@123.com",
    password: bcrypt.hashSync('123', 10),
  },
  "natta": {
    id: "natta",
    email: "natta@example.com",
    password: bcrypt.hashSync('dishwasher-funk', 10),
  },
};

//GET Methods
app.get("/", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.session);
  res.render("urls_index", templateVars );
});

app.get("/urls", (req, res) => {
  res.redirect("urls_read");
});

app.get("/urls_read", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.session);
  res.render("urls_read", templateVars);
});

app.get("/u/:shortUrl", (req, res) => {
  const short = req.params['shortUrl'];
  const dataRecord = urlDatabase[short];
  console.log(dataRecord.longUrl);
  res.redirect(dataRecord.longUrl);
});

app.get("/urls_update", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.session);
  res.render("urls_update", templateVars);
});

app.get("/urls_delete", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.session);
  res.render("urls_delete", templateVars);
});

app.get("/urls_create", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.session);

  res.render("urls_create", templateVars);
});

app.get("/register", (req, res) => {
  res.render('register');
});

app.get("/login", (req, res) => {

  const templateVars = help.setTemplateVars(urlDatabase, userList, req.session);
  res.render('login', templateVars);
});

//POST Methods

app.post("/urls_create", (req, res) => {
  const newStr = help.genRandomStr();
  const newUrl = {
    longUrl: req.body.longURL,
    ownerId: req.session["user_id"],
  };
  urlDatabase[newStr] = newUrl;
  res.redirect('/');
});

app.post("/urls_delete", (req, res) => {
  delete urlDatabase[req.body.urlToDelete];
  res.redirect('/urls');
});

app.post("/urls_update", (req, res) => {
  console.log(req.session);
  const updatedUrl = {
    longUrl: req.body.newURL,
    ownerId: req.session["user_id"],
  };
  urlDatabase[req.body.shortURL] = updatedUrl;
  res.redirect('/');
});

app.post("/login", (req, res) => {
  const user = help.getUserByEmail(req.body.userEmail, userList);
  if (!user){
    res.status(404).render('login', {error:'You are not yet a user, please register'});
  }else if(!help.passwordMatches(req.body.userEmail, req.body.password, userList)){
    res.status(404).render('login',
      {error: 'The username/password comination you entered does not match our records'}
    );
    return;
  }
  req.session.user_id = user.id;
  res.redirect('/');

});

app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const newUserId = help.genRandomStr();
  if (help.isEmptyString(req.body.email) ||
      help.isEmptyString(req.body.password)
    ){
    res.status(404).render('register', {error: 'Ensure all fields are populated.'});
  }else if (help.userExists(userList, req.body.email)){
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
