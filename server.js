/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Justin Cook   Student ID: 118404169   Date: 2017-02-25
*
* Online (Heroku) Link: https://vast-stream-84912.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var service = require("./data-service.js");
var querystring = require("querystring");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: 'layout',
  helpers: {
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set("view engine", ".hbs");


var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.render("home");
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
  res.render("about");
});
// setup a route to listen for employee queries
app.get("/employees", function (req, res) {
  var result = querystring.parse(req.originalUrl, "?", "=");
  if (result.department) {
    service.getEmployeesByDepartment(result.department).then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json({ message: err });
    })
  }

  else if (result.status) {
    service.getEmployeesByStatus(result.status).then(function (data) {
      res.json(data);
    }).catch((err) => {
      res.json({ message: err });
    })
  }
  else if (result.manager) {
    service.getEmployeesByManager(result.manager).then(function (data) {
      res.json(data);
    }).catch((err) => {
      res.json({ message: err });
    })
  }
  else {
    service.getAllEmployees().then((data) => {
      res.json(data)
    }).catch((err) => {
      res.json({ message: err });
    })
  }

});
// setup route to employee plus a numeric value for which employee you are looking for
app.get("/employee/:num", function (req, res) {
  service.getEmployeeByNum(req.params.num).then(function (data) {
    res.json(data);
  }).catch((err) => {
    res.json({ message: err });
  })
});
// setup route for all managers
app.get("/managers", function (req, res) {
  service.getManagers().then(function (data) {
    res.json(data);
  }).catch((err) => {
    res.json({ message: err });
  })
});
// setup route for all departments
app.get("/departments", function (req, res) {
  service.getDepartments().then(function (data) {
    res.json(data);
  }).catch((err) => {
    res.json({ message: err });
  })
});
// send a status code and a message when going to a route that's not included
app.use(function (req, res) {
  res.status(404);
  res.send("Page Not found");
});

// setup http server to listen on HTTP_PORT
service.initialize().then(() => {
  app.listen(HTTP_PORT, onHttpStart);
}).catch(() => {
  console.log("Error initializing.");
})