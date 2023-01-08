var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

const sequelize = new Sequelize('ourDatabase', 'root', 'password', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000

    },
    operatorsAliases: false
});

//set up user table
var User = sequelize.define('users',{
    id: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
});

User.beforeCreate((user, options) => {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
});

User.prototype.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

// create all defined table in the specified database
sequelize.sync()
    .then(() => console.log('user tables has been successfully created if one does not exist'))
    .catch(error => console.log('this error occured', error));

//
module.exports = Users;
