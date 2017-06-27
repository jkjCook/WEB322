/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Justin Cook   Student ID: 118404169   Date: 2017-06-10
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
const Sequelize = require('sequelize');
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
var sequelize = new Sequelize('db1uv67glvpsgd', 'zmbplreuxcxmck', '60f3401ef3f6045f8c33c089c5f1de6c6cfdf167e022d3d085724f3bfb275bd2', {
 host: 'ec2-23-21-246-11.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: true
 }
});


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
      res.render("employeeList", { data: data, title: "Emoloyees" });
    }).catch((err) => {
      res.render("employeeList", { data: {}, title: "Employees" });
    })
  }

  else if (result.status) {
    service.getEmployeesByStatus(result.status).then(function (data) {
      res.render("employeeList", { data: data, title: "Employees" });
    }).catch((err) => {
      res.render("employeeList", { data: {}, title: "Employees" });
    })
  }
  else if (result.manager) {
    service.getEmployeesByManager(result.manager).then(function (data) {
      res.render("employeeList", { data: data, title: "Employees" });
    }).catch((err) => {
      res.render("employeeList", { data: {}, title: "Employees" });
    })
  }
  else {
    service.getAllEmployees().then((data) => {
      res.render("employeeList", { data: data, title: "Employees" });
    }).catch((err) => {
      res.render("employeeList", { data: {}, title: "Employees" });
    })
  }

});
// setup route to employee plus a numeric value for which employee you are looking for
app.get("/employee/:num", function (req, res) {
  service.getEmployeeByNum(req.params.num).then(function (data) {
    res.render("employee", { data: data });
  }).catch((err) => {
    res.status(404).send("Employee Not Found"); 
  })
});
// setup route for all managers
app.get("/managers", function (req, res) {
  service.getManagers().then(function (data) {
     res.render("employeeList", { data: data, title: "Employees (Managers)" });
  }).catch((err) => {
    res.render("employeeList", { data: {}, title:"Employees (Managers)" });
  })
});
// setup route for all departments
app.get("/departments", function (req, res) {
  service.getDepartments().then(function (data) {
    res.render("departmentList", { data: data, title: "Departments" });
  }).catch((err) => {
    res.render("departmentList", { data: {}, title: "Departments" });
  })
});
//Route to add new employee
app.get("/employees/add", (req, res) => {
  res.render("addEmployee");
});
//Post route for adding a new employee
app.post("/employees/add", (req, res) => {
  service.addEmployee(req.body).then(() => {
    res.redirect("/employees");
  }).catch((err) => {
    res.json(err);
  })
});
//Post route to update employee information
app.post("/employee/update", (req, res) => {
 service.updateEmployee(req.body).then(() =>{
   res.redirect("/employees");
 }).catch(() =>{
   console.log("Error!");
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
}).catch((err) => {
  console.log(err);
})