const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
}



module.exports = sequelize;

module.exports = {'production': {

  'use_env_variable': 'JAWSDB_URL',
  
  'dialect': 'mysql'
  
  }}
