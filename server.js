/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Justin Cook   Student ID: 118404169   Date: 2017-06-27
*
* Online (Heroku) Link: https://jcook17.herokuapp.com/
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
var service = require("./data-service.js");
var querystring = require("querystring");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dataServiceComments = require("./data-service-comments.js");
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
      res.render("employeeList", { data: data, title: "Employees" });
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
app.get("/employee/:empNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  service.getEmployeeByNum(req.params.empNum)
    .then((data) => {
      viewData.data = data; //store employee data in the "viewData" object as "data"
    }).catch(() => {
      viewData.data = null; // set employee to null if there was an error
    }).then(service.getDepartments)
    .then((data) => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"

      // loop through viewData.departments and once we have found the departmentId that matches
      // the employee's "department" value, add a "selected" property to the matching
      // viewData.departments object
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.data.department) {
          viewData.departments[i].selected = true;
        }
      }
    }).catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
      if (viewData.data == null) { // if no employee - return an error
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", { viewData: viewData }); // render the "employee" view
      }
    });
});
app.get("/department/:departmentId", (req, res) => {
  service.getDepartmentById(req.params.departmentId).then((data) =>{
    res.render("department", {data: data})
  }).catch(() => {
    res.status(404);
    res.send("Department Not Found");
  })
});
// setup route for all managers
app.get("/managers", function (req, res) {
  service.getManagers().then(function (data) {
    res.render("employeeList", { data: data, title: "Employees (Managers)" });
  }).catch((err) => {
    res.render("employeeList", { data: {}, title: "Employees (Managers)" });
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
  service.getDepartments().then((data) => {
    res.render("addEmployee", { departments: data });
  }).catch(() => {
    res.render("addEmployee", { departments: [] });
  })
});
//Route to add new department
app.get("/departments/add", (req, res) => {
  res.render("addDepartment");
});
//Post route for adding a new employee
app.post("/employees/add", (req, res) => {
  service.addEmployee(req.body).then(() => {
    res.redirect("/employees");
  }).catch((err) => {
    res.json(err);
  })
});
//Post route for adding new department
app.post("/departments/add", (req, res) => {
  service.addDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((err) => {
    res.json(err);
  })
});
//Post route to update employee information
app.post("/employee/update", (req, res) => {
  service.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
  }).catch(() => {
    console.log("Error!");
  })
});
//Post route to update department
app.post("/departments/update", (req, res) => {
  service.updateDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch(() => {
    console.log("Error!");
  })
});
app.get("/employee/delete/:empNum", (req, res) => {
  service.deleteEmployeeByNum(req.params.empNum).then(() => {
    res.redirect("/employees");
  }).catch(() => {
    res.status(500);
    res.send("Unable to Remove Employee / Employee not found");
  })
})


// send a status code and a message when going to a route that's not included
app.use(function (req, res) {
  res.status(404);
  res.send("Page Not found");
});

// setup http server to listen on HTTP_PORT
service.initialize().then((data) => {
  app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
  console.log(err);
})

