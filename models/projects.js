// Requiring bcrypt for password hashing.
var bcrypt = require("bcrypt-nodejs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define("Project", {
    // timestamps: false,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.INTEGER,
      allowNull: false,
  }, 
	  instructions: {
	    type: DataTypes.STRING,
	    allowNull: false,
	  },
    current_announcements: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    root_project: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    tagLine:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    description:{
       type: DataTypes.STRING
    },
    EducatorId:{
       type: DataTypes.INTEGER,
       allowNull: false,
    }
	    // country: {
	    //   type: DataTypes.STRING,
	    //   // allowNull: false,
	    // },
	    // state: {
	    //   type: DataTypes.STRING,
	    //   allowNull: false,
	    // },
	    // city: {
	    //   type: DataTypes.STRING,
	    //   allowNull: false,
	    // },
	    // keyword: {
	    //   type: DataTypes.STRING,
	    //   // allowNull: false,
	    // }
  }, {
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    },
    
    associations: {
      // put foregin key stuff here

      // put teacher id stuff here
    },

    hooks: {
      beforeCreate: function(user, options, cb) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        cb(null, options);
      }
    }
  });

  return Project;

};


