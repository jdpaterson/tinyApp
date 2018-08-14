const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const seq = new Sequelize('tinyapp', 'tinyapp', 'tinyapp', {
  dialect: 'postgres',
})
const {User, Url, Visit} = require('./schema');
const randomString = require('randomstring');

User.create({
  email: '123@123.com',
  password: bcrypt.hashSync('123', 10),
}).then(() => {
  User.create({
    email: "natta@example.com",
    password: bcrypt.hashSync('1234', 10),
  })
}).then(() => {
  User.create({
    email: 'lastemail@example.com',
    password: bcrypt.hashSync('23456', 10)
  })
}).then(() => {
  Url.create({
    id: 1,
    long_url: 'http://www.lighthouselabs.ca',
    owner_id: 1,
    short_url: randomString(6);
  })
}).then(() => {
  Url.create({
    id: 2,
    long_url: 'http://www.google.com',
    owner_id: 2,
    short_url: randomString(6);
  })
})
.then(() => {
  Visit.create({
    visitor_id: 3,
    url_id: 1
  })
}).then(() => {
  Visit.create({
    visitor_id: 3,
    url_id: 2
  })
}).then(() => {
  Visit.create({
    visitor_id: 4,
    url_id: 1
  })
}).then(() => {
  Visit.create({
    visitor_id: 5,
    url_id: 2
  })
}).then(() => {
  Visit.create({
    visitor_id: 6,
    url_id: 1
  })
}).then(() => {
  Visit.create({
    visitor_id: 7,
    url_id: 1
  })
}).then(() => {
  Visit.create({
    visitor_id: 6,
    url_id: 2
  })
}).then(() => {
  Visit.create({
    visitor_id: 8,
    url_id: 2
  })
})
