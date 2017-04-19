// Requiring our models and passport as we've configured it
var db = require("../models");
var path = require("path")
// var passportStudent = require("../config/passportStudent");
// var passportTeacher = require("../config/passportTeacher");
var passport = require("../config/passport");

module.exports = function(app) {
  console.log("apiroutes.js function")
  // know that api routes is loaded & working



  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the landing page.
  // Otherwise the user will be sent an error
 app.post("/api/login/teacher", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });



 app.post("/api/login/student", passport.authenticate("local"), function(req, res) {
  // just like teacher/educator - except for student
    res.json(req.user);
    
  });




app.get('/view/studentid', function(req,res){

  console.log("app get req.body = " + JSON.stringify(req.body))

  db.Student.findAll({ 
    where: {
      // id: req.params.studentid,
         id: req.body.id,
    },
    include: [db.StudentToProject]
  }).then(function(result) {
      var student_objs = result; 

      // Get the ids of each of the projects the student is working on 
      var projIds = []
      for (i in student_objs){          
        projIds.push(student_objs[i].dataValues.StudentToProject.dataValues.ProjectId)
      }

      console.log("projIds" + projIds)
      db.Project.findAll({ 
        where: {
          id: projIds,
        },
        include: [db.Educator]

      }).then(function(result) {

        var obj_for_handlebars = []
        for (i in result){
          obj_for_handlebars.push(result[i].dataValues)
        }

        console.log(obj_for_handlebars)
        // res.sendFile(path.join(__dirname + "/../public/students/student-view", obj_for_handlebars ))
         res.sendFile(path.join(__dirname + "/../public/students/student-view" ))
      

      });

    });
});
  

  // app.get("/api/teachers", function(req, res) {
  //   db.Educator.findAll({
     
  //   }).then(function(dbTeacher) {
  //     res.json(dbTeacher);
  //   });
  // });

  app.get("/api/projects", function(req, res) {
    db.Project.findAll({
     
    }).then(function(dbProject) {
      res.json(dbProject);
    });
  });

    app.post("/api/studentAndProject", function(req, res) {
      console.log(req.body);
      db.StudentToProject.create({
          ProjectId: req.body.ProjId,
          StudentId: req.body.StuId,
      }).then(function(){
        console.log("added to StudentToProject")
      }).catch(function(err){
        console.log("error adding to StudentToProject  " + err)
      });
    });

    app.post("/api/signup/teacher", function(req, res) {
    console.log("teacher sign up" );
    console.log(req.body)
    db.Educator.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    }).then(function(dbEducator) {
      console.log("post educator sign up then clause")
       res.json(dbEducator);
    }).catch(function(err) {
      console.log("post ed add: "+ err)
      if (err != undefined) {
           res.status(500).json(err)
    }
    });
  });




  // this posts the student information to the student table
 app.post("/api/signup/student", function(req, res) {
    db.Student.create(
     {
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
    }
    ).then(function(dbStudent) {
      // return the student information
       res.json(dbStudent);
            
    }).catch(function(err) {
      // catch errors and send them back to the calling function

      console.log("app post - " + err);
     if (err != undefined) {
           res.status(500).json(err)
    }
    });

    
  });


  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

   ////GET Route for entering observations
app.get("/api/fieldnotes", function(req, res) {
    console.log(req.body);
    res.render('notes');
  });

  //POST Route for entering observations
  app.post("/api/fieldnotes", function(req, res) {
    console.log(req.body);
    /*db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      res.json(err);
    });*/
  });

  // Route for getting some data about our user to be used client side

  // this needs to be updated since we are pulling user info from
  // different tables if it is a student or teacher


  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      res.json({
        email: req.user.email,
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
      });
    }
  });

};
