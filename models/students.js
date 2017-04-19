// Requiring bcrypt for password hashing. 
var bcrypt = require("bcrypt-nodejs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var Student = sequelize.define("Student", {
    // timestamps: false,
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false,
  	}, 
	username: {
	   type: DataTypes.STRING,
	   allowNull: false,
	},
	country: {
		type: DataTypes.STRING,
	    allowNull: false,
	},
	state: {
	  	type: DataTypes.STRING,
	},
	city: {
	    type: DataTypes.STRING,
	    allowNull: false,
        validate: {
          len:[1,200]
        }
	},
  }, {
    // Creating a custom method for our User model.
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    },
    
    validate: {
    	statesUS:  function() {
    		if (this.country == "United States of America" && this.state.trim() == "") {
    			throw new Error("In the US state is required")
    		}
    	},
    },

    hooks: {
      beforeCreate: function(user, options, cb) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        cb(null, options);
      }
    }
  });
  return Student;

};
