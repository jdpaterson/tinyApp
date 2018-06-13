const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const help = require("./help.js");
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
  function (err, req, res, next) {
    console.error(err.stack)
    res.status(400).send('Something broke!')
  });

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userList = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
};

//GET Methods
app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    userList: userList,
  };
  if (req.cookies["user_id"] !== undefined){
    const user = help.getUserById(req.cookies["user_id"], userList)
    templateVars.user = user;
  }

  res.render("urls_index", templateVars );
});

app.get("/urls", (req, res) => {
  const user = help.getUserById(req.cookies["user_id"], userList)
  const templateVars = {
    urls: urlDatabase,
    user: user,
    userList: userList
  };
  res.render("urls_index", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params['shortURL']];
  res.redirect(longURL);
});
app.get("/urls_update/", (req, res) => {
  const user = help.getUserById(req.cookies["user_id"], userList)
  const templateVars = {
    urls: urlDatabase,
    username: user,
  };
  res.render("urls_update", templateVars);
});
app.get("/urls_delete", (req, res) => {
  const user = help.getUserById(req.cookies["user_id"], userList)
  const templateVars = {
    urls: urlDatabase,
    username: user,
  };
  res.render("urls_delete", templateVars);
});
app.get("/urls_new", (req, res) => {
  const user = help.getUserById(req.cookies["user_id"], userList)
  const templateVars = {
    urls: urlDatabase,
    username: user,
  };
  res.render("urls_new", templateVars);
});
app.get("/register", (req, res) => {
  res.render('register');
});
app.get("/login", (req, res) => {
  res.render('login');
});

//POST Methods
app.post("/urls_new", (req, res) => {
  const newStr = help.genRandomStr();
  urlDatabase[newStr] = req.body.longURL;
  res.redirect('/');
});
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});
app.post("/urls_update", (req, res) => {
  urlDatabase[req.body.shortURL] = req.body.newURL;
  res.redirect('/');
});
app.post("/login", (req, res) => {
  const user = help.getUserByEmail(req.body.userEmail, userList);
  if (!user){
    res.status(400).send('You are not yet a user, please register');
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
    res.status(404).send('Ensure all fields are populated.');
  }else if (help.userExists(userList, req.body.email)){
    res.status(404).send('User already exists, please login.');
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
