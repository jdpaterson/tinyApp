const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const help = require("./help.js");
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

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
    password: "123"
  },
  "natta": {
    id: "natta",
    email: "natta@example.com",
    password: "dishwasher-funk"
  },
};

//GET Methods
app.get("/", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.cookies);
  res.render("urls_index", templateVars );
});

app.get("/urls", (req, res) => {
  res.redirect("urls_read");
});

app.get("/urls_read", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.cookies);
  res.render("urls_read", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params['shortURL']];
  res.redirect(longURL);
});

app.get("/urls_update", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.cookies);
  res.render("urls_update", templateVars);
});

app.get("/urls_delete", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.cookies);
  res.render("urls_delete", templateVars);
});

app.get("/urls_create", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.cookies);

  res.render("urls_create", templateVars);
});

app.get("/register", (req, res) => {
  res.render('register');
});

app.get("/login", (req, res) => {
  const templateVars = help.setTemplateVars(urlDatabase, userList, req.cookies);
  res.render('login', templateVars);
});

//POST Methods

app.post("/urls_create", (req, res) => {
  const newStr = help.genRandomStr();
  urlDatabase[newStr] = req.body.longURL;
  res.redirect('/');
});

app.post("/urls_delete", (req, res) => {
  delete urlDatabase[req.body.urlToDelete];
  res.redirect('/urls');
});

app.post("/urls_update", (req, res) => {
  console.log(req.cookies);
  updatedUrl = {
    longUrl: req.body.newURL,
    ownerId: req.cookies["user_id"],
  };
  urlDatabase[req.body.shortURL] = req.body.newURL;
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
  res.cookie('user_id', user.id);
  res.redirect('/urls');

});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
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
      password: req.body.password,
    };

    userList[newUserId] = newUser;
    res.cookie('user_id', newUser.id);
    res.redirect('/urls');
  }
})

//Start Server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
