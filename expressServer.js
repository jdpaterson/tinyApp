const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const help = require("./help.js");
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars );
});
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params['shortURL']];
  res.redirect(longURL);
});
app.get("/urls_update/", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_update", templateVars);
});
app.get("/urls_delete", (req, res) => {
  console.log('Deleting');
  let templateVars = {urls: urlDatabase};
  res.render("urls_delete", templateVars);
});
app.get("/urls_new", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_new", templateVars);
});
app.post("/urls_new", (req, res) => {
  let newStr = help.genRandomStr();
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
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
