// Import the necessary modules
const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");

// Create the User model
class User extends Model {
  // Method to compare the plaintext password from the login form with the hashed password stored in the database
  async checkPassword(loginPw) {
    return await bcrypt.compare(loginPw, this.password);
  }
}

// Define the fields and options of the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER, // The ID field is of type INTEGER
      allowNull: false, // The ID field cannot be null
      primaryKey: true, // The ID field is the primary key
      autoIncrement: true, // The ID field is auto-incremented
    },
    name: {
      type: DataTypes.STRING, // The name field is of type STRING
      allowNull: false, // The name field cannot be null
    },
    password: {
      type: DataTypes.STRING, // The password field is of type STRING
      allowNull: false, // The password field cannot be null
      validate: {
        len: [8], // The password must be at least 8 characters long
      },
    },
    score: {
      type: DataTypes.INTEGER, // The score field is of type INTEGER
      allowNull: false, // The score field cannot be null
      defaultValue: 0, // The score field has a default value of 0
    },
  },
  {
    hooks: {
      // Hash the plaintext password before creating a new user
      beforeUpdate: async (updatedUserData) => {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    // Use sequelize to connect to the database
    sequelize,
    // Disable timestamps
    timestamps: false,
    // Use the user table name
    freezeTableName: true,
    // Use snake_case for columns
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
// This code exports the User model so it can be used by other parts of the application.
