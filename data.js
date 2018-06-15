const bcrypt = require('bcryptjs');
const help = require('./help');

const userList = {
  "supGuy": {
    id: "supGuy",
    email: "123@123.com",
    password: bcrypt.hashSync('123', 10),
  },
  "natta": {
    id: "natta",
    email: "natta@example.com",
    password: bcrypt.hashSync('1234', 10),
  },
};

const urlDatabase = {
  "b2xVn2": {
    id: "b2xVn2",
    longUrl: "http://www.lighthouselabs.ca",
    ownerId: "natta",
    visits: ["vist_4","vist_5"],
    timesVisited () {
      return this.visits.length;
    },
    uniqueVisitors () {
      return help.countUniqueVisitors(visitsDB, this.visits);
    },
    createdTime: new Date(1987, 05, 12, 4, 30, 25, 00),
  },
  "9sm5xK": {
    id: "9sm5xK",
    longUrl: "http://www.google.com",
    ownerId: "supGuy",
    visits: ["vist_1", "vist_2", "vist_3", "vist_6", "vist_7"],
    timesVisited () {
      return this.visits === undefined ? 0 : this.visits.length;
    },
    uniqueVisitors () {
      return this.visits === undefined ? 0 : help.countUniqueVisitors(visitsDB, this.visits);      
    },
    createdTime: new Date(2008, 06, 10, 5, 10, 12, 00),
  },
};

const visitsDB = {
  "vist_1": {
    id: "vist_1",
    visitor_id: "visitor_1",
    shortUrl: "b2xVn2",
    time_stamp: new Date(2018, 06, 15, 12, 10, 12, 36),
  },
  "vist_2": {
    id: "vist_2",
    visitor_id: "visitor_2",
    shortUrl: "b2xVn2",
    time_stamp: new Date(2018, 06, 15, 12, 10, 12, 36),
  },
  "vist_3": {
    id: "vist_3",
    visitor_id: "visitor_2",
    url: "b2xVn2",
    time_stamp: new Date(2018, 06, 15, 12, 10, 12, 36),
  },
  "vist_4": {
    id: "vist_4",
    visitor_id: "visitor_3",
    url: "b2xVn2",
    time_stamp: new Date(2018, 06, 15, 12, 10, 12, 36),
  },
  "vist_5": {
    id: "vist_5",
    visitor_id: "visitor_3",
    url: "9sm5xK",
    time_stamp: new Date(2018, 06, 15, 12, 10, 12, 36),
  },
  "vist_6": {
    id: "vist_6",
    visitor_id: "visitor_3",
    url: "9sm5xK",
    time_stamp: new Date(2018, 06, 15, 12, 10, 12, 36),
  },
  "vist_7": {
    id: "vist_7",
    visitor_id: "visitor_2",
    url: "9sm5xK",
    time_stamp: new Date(2018, 06, 15, 12, 10, 12, 36),
  },
}

module.exports = {
  userList: userList,
  urlDatabase: urlDatabase,
  visitsDB: visitsDB,

}
