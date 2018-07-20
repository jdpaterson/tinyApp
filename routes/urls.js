const express = require('express');
const router = express.Router();

//View User URLs page
router.get("/urls", (req, res) => {
  if (req.session.user === undefined){
    res.status(404).redirect('/login');
  }else{
    help.getUserUrls(req.session.user).then((urls) => {
      res.render("urls_read", {
        urls: urls,
        user: req.session.user
      })
    })
  }
})

//Render the add new URL page
router.get("/urls/new", (req, res) => {
  if (req.session.user === undefined){
    res.status(404).render('login', {
      error:'You are not logged in, please register or login'
    })
  }else{
    res.render("urls_new", {
      user: req.session.user
    })
  }
})

//Render the update URL page
router.get("/urls/:id", (req, res) => {
  if (!req.session.user){
    res.status(404).render('login', {
      error:'You are not logged in, please register or login'
    });
  }else{
    Url.findById(req.params.id).then((url) => {
      if (!url){
        res.status(404).render('urls_read', {
          error:'We can\'t find an Id matching that value.'
        })
      }else{
        if(url.owner_id === req.session.user.id){
          res.render('url_edit', {
            urlToEdit: url,
            user: req.session.user
          })
        }else{
          res.status(404).send
          ('You do not own that key');
        }
      }
    })
  }
})

//POST Methods

//Add new URL
router.post("/urls", (req, res) => {
  help.insUrl(req).then((url) => {
    res.redirect('/urls');
  })
})

//Update existing URL
router.post("/urls/:id", (req, res) => {
  help.updUrl(req).then((resp) => {
    res.redirect('/');
  })
})

//Delete existing URL
router.delete("/urls/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

module.exports = router;
