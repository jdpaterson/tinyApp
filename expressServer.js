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
app.get("/urls_show/", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_show", templateVars);
});
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});
app.post("/urls_show/:id", (req, res) => {
  console.log('Req: ' + req);
  console.log('Res: ' + res);
  //urlDatabase[req.params.id] =
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
