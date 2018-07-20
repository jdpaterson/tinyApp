const express = require('express');
const router = express.Router();
const help = require('../help');

//View User URLs page
router.get("/", (req, res) => {
  if (req.session.user === undefined){
    res.status(404).redirect('/login');
  }else{
    help.getUserUrls(req.session.user).then(async (urls) => {
      for (url of urls){
        url.timesVisited = await help.getTimesVisited(url);
        url.uniqueVisitors = await help.getUniqueVisitors(url);
      }
      res.render("urls_read", {
        urls: urls,
        user: req.session.user
      })
    })
  }
})

//Render the add new URL page
router.get("/new", (req, res) => {
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
router.get("/:id", (req, res) => {
  if (!req.session.user){
    res.status(404).render('login', {
      error:'You are not logged in, please register or login'
    });
  }else{
    help.getUrlById(req.params.id).then((url) => {
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
router.post("/", (req, res) => {
  help.insUrl(req).then((url) => {
    res.redirect('/urls');
  })
})

//Update existing URL
router.post("/:id", (req, res) => {
  console.log('HERE I AM!!!!!')
  help.updUrl(req).then((resp) => {
    res.redirect('/');
  })
})

//Delete existing URL
router.delete("/:id", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

module.exports = router;
