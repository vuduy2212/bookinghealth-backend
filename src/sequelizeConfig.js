const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bookinghealth', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    port: '127.0.0.1',
});

module.exports = sequelize;
