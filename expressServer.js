const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const randomString = require("./app.js");
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Welcome to the home page!\n");
});
app.get("/urls", (req, res) => {
  res.render("urls_index", urlDatabase);
})
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params['shortURL']];
  res.redirect(longURL);
})
app.post("/urls", (req, res) => {
  const rStr = randomString.generateRandomString();
  urlDatabase[rStr] = req.body.longURL;
  res.send(urlDatabase);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
