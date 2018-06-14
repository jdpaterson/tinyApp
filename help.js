const randomString = require('randomString');
const bcrypt = require('bcryptjs');

function generateRandomString() {
  return randomString.generate(6);
}

function isEmptyString(str){
  if (str === ''){
    return true;
  }else{
    return false;
  }
}

function userExists(userList, email){
  for (user in userList){
    if (userList[user].email === email){
      return true;
    }
  }
  return false;
}

function getUserById(userId, userList){
  for (userKey in userList){
    if (userId === userList[userKey].id){
      return userList[userKey];
    }
  }
  return false;
}

function getUserByEmail(userEmail, userList){
  for (userKey in userList){
    if (userEmail === userList[userKey].email){
      return userList[userKey];
    }
  }
  return false;
}

function setTemplateVars(urls, userData, session){
  const userURLs = {};

  const templateVars = {
    urls: urls,
  };
  if (session !== undefined){
    if (session["user_id"] !== undefined){
      const user = getUserById(session["user_id"], userData);
      var userUrls = getUserUrls(user.id, urls);

      if (user){
        templateVars.user = user;
        templateVars.user.userUrls = getUserUrls(user.id, urls);
      }
    }
  }
  return templateVars;
}

function getUserUrls(userId, urls){
  const userUrls = {};
  for (let url in urls){
    if (urls[url].ownerId === userId ){
      userUrls[url] = urls[url];
    }
  }
  return userUrls;
}

function passwordMatches(email, password, userList){
  for (user in userList){
    if (email === userList[user].email){
      return bcrypt.compareSync(password,  userList[user].password)
    }
  }
  return false;
}

function urlExists(url, urlList){
  if (Object.keys(urlList).indexOf(url) > -1){
    return true;
  }else{
    return false;
  }
}

function getUrlByShort(shortUrl, urlList){
  for (url in urlList){
    if (url === shortUrl){
      return urlList[url];
    }
  }
  return false;
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
  userExists: userExists,
}
