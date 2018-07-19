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

function getUrlByShort(shortUrl, urlList){
  return _.pick(urlList, shortUrl);
}

function addVisit(url, visitor_id, visitsDB){
  console.log('URL: ', url);
  console.log('VID: ', visitor_id);
  console.log('VDB: ', visitsDB);
  var vistId = generateRandomString();
  const visit = {
    id: vistId,
    visitor_id: visitor_id,
    url: url.id,
    createdTime: Date.now(),
  };
  if (url.visits === undefined){
    url.visits = [];
  }
  url.visits.push(visit.id);
  visitsDB[vistId] = visit;

}

const countUniqueVisitors = function(visitsDB, urlVisits){
  let numOfVisits = _.pick(visitsDB, ...urlVisits);
  let visitors = [];
  for (let visit in numOfVisits ){
    visitors.push(numOfVisits[visit].visitor_id);
  }

  return _.uniq(visitors).length;
}

function genNewUrl(req, visitsDB){
  const newStr = this.genRandomStr();
  const newUrl = {
    id: newStr,
    longUrl: req.body.longURL,
    ownerId: req.session["user_id"],
    visits: [],
    timesVisited () {
      return this.visits.length;
    },
    uniqueVisitors () {
      return countUniqueVisitors(visitsDB, this.visits);
    },
  };
  return newUrl;
}

module.exports = {
  setTemplateVars: setTemplateVars,
  urlExists: urlExists,
  getUrlByShort: getUrlByShort,
  getUserUrls: getUserUrls,
  genRandomStr: generateRandomString,
  getUserByEmail: getUserByEmail,
  passwordMatches: passwordMatches,
  isEmptyString: isEmptyString,
  addVisit: addVisit,
  countUniqueVisitors: countUniqueVisitors,
  genNewUrl: genNewUrl,
}
