const randomString = require('randomString');

function generateRandomString() {
  return randomString.generate(6);
}

module.exports = {
  generateRandomString: generateRandomString,
}
