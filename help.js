const randomString = require('randomString');
const bcrypt = require('bcrypt');
const {User, Url, Visit} = require("./db/schema");

function generateRandomString() {
  return randomString.generate(6);
}

function isEmptyString(str){
  return str === '' ? true : false;
}

function getUserByEmail(userEmail){
  return User.findOne({
    where: {
      email: userEmail
    }
  })
}

function passwordMatches(user, password){
  return bcrypt.compareSync(password,  user.password)
}

function getUserUrls(user, urls){
  return Url.findAll({
    where: {
      owner_id: user.id
    }
  })
}

function createUser(email, pass){
  return User.create({
    email: email,
    password: bcrypt.hashSync(pass, 10),
  })
}

function getUrlById(urlId){
  return Url.findById(urlId)
}

function getUrlByShort(short_url){
  return Url.find({
    where: {
      short_url: short_url
    }
  })
}

function addVisit(url, visitor_id){
  return Visit.create({
    url_id: url.id,
    visitor_id: visitor_id
  })
}

function insUrl(req){
  const newUrl = {
    short_url: randomString.generate(6),
    long_url: req.body.longURL,
    owner_id: req.session.user.id
  }
  return Url.create(newUrl);
}

function updUrl(req){
  return Url.findById(req.params.id).then((url) => {
    url.long_url = req.body.newURL;
    url.save();
  })
}

module.exports = {
  getUserUrls: getUserUrls,
  genRandomStr: generateRandomString,
  getUserByEmail: getUserByEmail,
  passwordMatches: passwordMatches,
  isEmptyString: isEmptyString,
  addVisit: addVisit,
  insUrl: insUrl,
  updUrl: updUrl,
  createUser: createUser,
  getUrlById: getUrlById,
  getUrlByShort: getUrlByShort
}
