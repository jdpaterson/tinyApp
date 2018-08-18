const express = require('express');
const router = express.Router();
const help = require('../help');

//Return login form
router.get("/new", (req, res) => {
  if (req.session.user === undefined){
    res.render("login", {session: req.session});
  }else{
    res.redirect("/urls");
  }
})

//Login user
router.post("/", (req, res) => {
  help.getUserByEmail(req.body.userEmail)
  .then((user) => {
    if (!user){
      res.status(404).render('login',
      {
        error:'You are not yet a user, please register',
        session: req.session
      })
    }else if(!help.passwordMatches(user, req.body.password)){
      res.status(404).render('login',
      {
        error: `The username/password combination you entered does
        not match our records`,
        session: req.session
      })
      return;
    }else{
      req.session.user = user;
      res.redirect('/urls');
    }
  })
})

//Logout User
router.delete("/", (req, res) => {
  res.clearCookie('session');
  res.redirect('/');
})

module.exports = router;
