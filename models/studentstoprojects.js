// Requiring bcrypt for password hashing. 
var bcrypt = require("bcrypt-nodejs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var StudentToProject = sequelize.define("StudentToProject", {
    // timestamps: false,
    // project_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // student_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  }, {
   
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    },
    
    associations: {
    },

    hooks: {
      beforeCreate: function(user, options, cb) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        cb(null, options);
      }
    }
  });
  return StudentToProject;

};