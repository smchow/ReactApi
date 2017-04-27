// Requiring necessary npm packages
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
//var multer = require('multer');
// Requiring passport as we've configured it

//var passport = require("./config/passport");


// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3636;
var db = require("./models");
var path = require("path");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(multer({dest: './tmp/'}));
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
/*app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());*/

// Requiring our routes
/*require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);*/

// Set Handlebars.
/*var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");*/

// Import routes and give the server access to them.

// var applicationRoutes = require("./controllers/applicationController.js")
var studentRoutes = require("./controllers/studentsController.js");
var notesRoutes = require("./controllers/notesController.js");
var projectRoutes = require("./controllers/projectController.js");
var educatorRoutes = require("./controllers/educatorsController.js")

//app.use("/", applicationRoutes)
app.use("/student", studentRoutes);
app.use("/notes", notesRoutes);
app.use("/project", projectRoutes);
app.use("/educator", educatorRoutes);

app.get('/notes/addImg', function(req,res){
  var AWS = require('aws-sdk');

var s3 = new AWS.S3();

// Bucket names must be unique across all S3 users

var myBucket = 'node-sdk-sample-test-04272017';

var myKey = 'hello_world.txt';



/*var myBucket = 'AKIAIJSVLR74BZAXOEMQ';

var myKey = 'HmBRnMDqvJaSOV9HI6NMTpUw19gqSOfPfQTiev1K';*/

s3.createBucket({Bucket: myBucket}, function(err, data) {

if (err) {

   console.log(err);

   } else {

     params = {Bucket: myBucket, Key: myKey, Body: 'Hello!'};

     s3.putObject(params, function(err, data) {

         if (err) {

             console.log(err)

         } else {

             console.log("Successfully uploaded data to myBucket/myKey");
             res.send(data);
         }

      });

   }

});
});



app.get('/view/:studentid', function(req,res){

  console.log("app get req.body = " + JSON.stringify(req.body))

  db.Student.findAll({ 
    where: {
       id: req.params.studentid,
      //   id: req.body.id,
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
         //res.sendFile(path.join(__dirname + "/../public/students/student-view" ))
        res.json(obj_for_handlebars);

      });

    });
});

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==>  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});