const Sequelize = require('sequelize');
const seq = new Sequelize('tinyapp', 'vagrant', 'tinyapp', {
  dialect: 'postgres',
})

const User = seq.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
})

const Url = seq.define('url', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  short_url: {
    type: Sequelize.STRING
  },
  long_url: {
    type: Sequelize.STRING,
  },
  owner_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
})

const Visit = seq.define('visit', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'urls',
      key: 'id'
    },
    onUpdate: 'cascade',
    onDelete: 'cascade'
  },
  visitor_id: {
    type: Sequelize.INTEGER
  },
  time_visited: {
    type: Sequelize.TIME
  }
})

User.sync().then(() => {
Url.sync();
}).then(() => {
Visit.sync();
})

module.exports = {
  User: User,
  Url: Url,
  Visit: Visit
}
