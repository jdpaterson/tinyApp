const randomString = require('randomString');
const bcrypt = require('bcrypt');
const {User, Url, Visit} = require("./db/schema");

function generateRandomString() {
  return randomString.generate(6);
}

function isEmptyString(str){
  return str === '' ? true : false;
}

function getUserById(userId, userList){
  return _.pick(userList, userId)[userId];
  //Else return false?
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

function getUrlById(urlId){
  return Url.findById(urlId)
}

function addVisit(urlId, visitor_id){
  return Visit.create({
    url_id: urlId
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
  urlExists: urlExists,
  getUserUrls: getUserUrls,
  genRandomStr: generateRandomString,
  getUserByEmail: getUserByEmail,
  passwordMatches: passwordMatches,
  isEmptyString: isEmptyString,
  addVisit: addVisit,
  insUrl: insUrl,
  updUrl: updUrl
}
