// Requiring bcrypt for password hashing. 
//var bcrypt = require("bcrypt-nodejs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var Fieldnote = sequelize.define("Fieldnote", {
    // timestamps: false,
    // The email cannot be null, and must be a proper email before creation
    title: {
      type: DataTypes.STRING,
      // allowNull: false,
      
    },
    doctype: {
      type: DataTypes.STRING,
      // allowNull: false,
      
    },
    // The password cannot be null
    doclink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notedate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // project_id: {
    //   type: DataTypes.INTEGER, 
    //   allowNull: false, 
    // },
    // student_id: {
    //   type: DataTypes.INTEGER, 
    //   allowNull: false, 
    // },
  }, {
    
  });
  return Fieldnote;

};
