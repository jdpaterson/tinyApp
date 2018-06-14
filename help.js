const randomString = require('randomString');

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

function setTemplateVars(urls, userData, cookies){
  const userURLs = {};

  const templateVars = {
    urls: urls,
  };
  if (cookies["user_id"] !== undefined){
    const user = getUserById(cookies["user_id"], userData);
    var userUrls = getUserUrls(user.id, urls);    

    if (user){
      templateVars.user = user;
      templateVars.user.userUrls = getUserUrls(user.id, urls);
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
      if (password === userList[user].password ){
        return true;
      }else{
        return false;
      }
    }
  }
  return false;
}

module.exports = {
  genRandomStr: generateRandomString,
  isEmptyString: isEmptyString,
  userExists: userExists,
  getUserById: getUserById,
  getUserByEmail: getUserByEmail,
  setTemplateVars: setTemplateVars,
  passwordMatches: passwordMatches,
}
