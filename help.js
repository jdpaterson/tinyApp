const randomString = require('randomString');
const bcrypt = require('bcrypt');
const _ = require('underscore');
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

function setTemplateVars(urls, userData, session, visitsDB){
  const templateVars = {
    urls: urls,
  };
  if (session !== undefined){
    if (session["user_id"] !== undefined){
      const user = getUserById(session["user_id"], userData);
      if (user){
        templateVars.user = user;
        templateVars.user.userUrls = getUserUrls(user.id, urls);
        templateVars.visitsDB = visitsDB;
      }
    }
  }
  return templateVars;
}

function getUserUrls(user, urls){
  return Url.findAll({
    where: {
      owner_id: user.id
    }
  })
}

function urlExists(url, urlList){
  if (_.pick(urlList, url).id === undefined){
    return false;
  }else{
    return true;
  }
}

function getUrlById(urlId){
  return Url.findById(urlId)
}

function addVisit(urlId, visitor_id){
  return Visit.create({    
    url_id: urlId
  })

}

const countUniqueVisitors = function(visitsDB, urlVisits){
  let numOfVisits = _.pick(visitsDB, ...urlVisits);
  let visitors = [];
  for (let visit in numOfVisits ){
    visitors.push(numOfVisits[visit].visitor_id);
  }

  return _.uniq(visitors).length;
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
  setTemplateVars: setTemplateVars,
  urlExists: urlExists,
  getUserUrls: getUserUrls,
  genRandomStr: generateRandomString,
  getUserByEmail: getUserByEmail,
  passwordMatches: passwordMatches,
  isEmptyString: isEmptyString,
  addVisit: addVisit,
  countUniqueVisitors: countUniqueVisitors,
  insUrl: insUrl,
  updUrl: updUrl
}
