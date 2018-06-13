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

module.exports = {
  genRandomStr: generateRandomString,
  isEmptyString: isEmptyString,
  userExists: userExists,
  getUserById: getUserById,
  getUserByEmail: getUserByEmail,
}
