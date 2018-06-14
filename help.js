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

function userExists(userList, userId, email){
  for (user in userList){
    if (userList[user].email === email){
      return true;
    }
    if (userList[user].id === userId){
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
  const templateVars = {
    urls: urls,
    userList: userData,
  };
  if (cookies["user_id"] !== undefined){
    const user = getUserById(cookies["user_id"], userData)
    if (user){
      templateVars.user = user;
    }
  }
  return templateVars;
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
