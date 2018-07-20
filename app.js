//WEB SERVER REQUIREMENTS
const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const Keygrip = require('keygrip');
const keys = new Keygrip(['SEKRIT2', 'SEKRIT1']);

const {User, Url, Visit} = require('./db/schema');
const help = require('./help.js');
const usersRoutes = require('./routes/users');
const sessionsRoutes = require('./routes/sessions');
const urlsRoutes = require('./routes/urls');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: keys,
  maxAge: 24 * 60 * 60 * 1000,
}))
app.use(methodOverride('_method'));

app.use('/users', usersRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/urls', urlsRoutes);

//Home page
app.get("/", (req, res) => {
  if (req.session.user === undefined){
    res.redirect("/sessions/new");
  }else{
    res.redirect("/urls");
  }
})

//Redirect to short URL
app.get("/u/:short_url", (req, res) => {
  if (req.session.visitor_id === undefined){
    req.session.visitor_id = help.genRandomStr();
  }
  help.getUrlByShort(req.params.short_url)
    .then((url) => {
      return help.addVisit(url, req.session.visitor_id);
    }).then((vis) => {
      return help.getUrlById(vis.url_id);
    }).then((url) => {
      res.redirect(url.long_url);
    }).catch((err) => {
      res.send({
        error: 'error'
      })
      console.log(err);
    })
})

//Start Server
app.listen(PORT, () => {
  console.log(`tinyApp listening on port ${PORT}!`);
})
