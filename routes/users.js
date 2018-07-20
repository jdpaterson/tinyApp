const express = require('express');
const router = express.Router();
const help = require('../help');

//Render registration page
router.get("/new", (req, res) => {
  res.render('register');
})

//Register new user
router.post("/", (req, res) => {
  const newUserId = help.genRandomStr();
  if (help.isEmptyString(req.body.email) ||
      help.isEmptyString(req.body.password)
    ){
    res.status(404).render('register', {
      error: 'Ensure all fields are populated.'
    })
  }else{
    help.getUserByEmail(req.body.email).then((user) => {
      if (user){
        res.status(404).render('register',{
          error: 'Email already exists, login or choose a different email.'
        })
      }else{
        help.createUser(req.body.email, req.body.password)
        .then((user) => {
          req.session.user = user;
          res.redirect('/urls');
        })
      }
    })
  }
})

module.exports = router;
