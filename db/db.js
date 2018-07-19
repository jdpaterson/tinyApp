const Sequelize = require('sequelize');
const seq = new Sequelize('tinyapp', 'vagrant', 'tinyapp', {
  dialect: 'postgres',
})

seq
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
