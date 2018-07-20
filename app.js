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
  maxAge: 24 * 60 * 60 * 1000 * 365,
}))
app.use(methodOverride('_method'));

app.use('/users', usersRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/urls', urlsRoutes);

//Redirect to short URL
app.get("/u/:id", (req, res) => {
  if (req.session.visitor_id === undefined){
    req.session.visitor_id = help.genRandomStr();
  }
  help.addVisit(req.params.id, req.session.visitor_id).then((vis) => {
    Url.findById(req.params.id).then((url) => {
        res.redirect(url.long_url);
    })
  })
});


//Start Server
app.listen(PORT, () => {
  console.log(`tinyApp listening on port ${PORT}!`);
})
