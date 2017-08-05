/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Justin Cook   Student ID: 118404169   Date: 18-JUL-2017
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
const dataServiceComments = require("./data-service-comments.js");
const clientSessions = require("client-sessions");
const dataServiceAuth = require("./data-service-auth.js")
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

app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "webapp_web322", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}


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
  dataServiceComments.getAllComments().then((data) => {
    res.render("about", { data: data });
  }).catch((err) => {
    res.render("about");
  })
});

// setup a route to listen for employee queries
app.get("/employees", ensureLogin, function (req, res) {
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
app.get("/employee/:empNum", ensureLogin, (req, res) => {
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
app.get("/department/:departmentId", ensureLogin, (req, res) => {
  service.getDepartmentById(req.params.departmentId).then((data) => {
    res.render("department", { data: data })
  }).catch(() => {
    res.status(404);
    res.send("Department Not Found");
  })
});
// setup route for all managers
app.get("/managers", ensureLogin, function (req, res) {
  service.getManagers().then(function (data) {
    res.render("employeeList", { data: data, title: "Employees (Managers)" });
  }).catch((err) => {
    res.render("employeeList", { data: {}, title: "Employees (Managers)" });
  })
});
// setup route for all departments
app.get("/departments", ensureLogin, function (req, res) {
  service.getDepartments().then(function (data) {
    res.render("departmentList", { data: data, title: "Departments" });
  }).catch((err) => {
    res.render("departmentList", { data: {}, title: "Departments" });
  })
});
//Route to add new employee
app.get("/employees/add", ensureLogin, (req, res) => {
  service.getDepartments().then((data) => {
    res.render("addEmployee", { departments: data });
  }).catch(() => {
    res.render("addEmployee", { departments: [] });
  })
});
//Route to add new department
app.get("/departments/add", ensureLogin, (req, res) => {
  res.render("addDepartment");
});
//Post route for adding a new employee
app.post("/employees/add", ensureLogin, (req, res) => {
  service.addEmployee(req.body).then(() => {
    res.redirect("/employees");
  }).catch((err) => {
    res.json(err);
  })
});
//Post route for adding new department
app.post("/departments/add", ensureLogin, (req, res) => {
  service.addDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((err) => {
    res.json(err);
  })
});
//Post route to update employee information
app.post("/employee/update", ensureLogin, (req, res) => {
  service.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
  }).catch(() => {
    console.log("Error!");
  })
});
//Post route to update department
app.post("/departments/update", ensureLogin, (req, res) => {
  service.updateDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch(() => {
    console.log("Error!");
  })
});
app.get("/employee/delete/:empNum", ensureLogin, (req, res) => {
  service.deleteEmployeeByNum(req.params.empNum).then(() => {
    res.redirect("/employees");
  }).catch(() => {
    res.status(500);
    res.send("Unable to Remove Employee / Employee not found");
  })
})
app.post("/about/addComment", (req, res) => {
  dataServiceComments.addComment(req.body).then((data) => {
    res.redirect("/about");
  }).catch((err) => {
    console.log(err);
    res.redirect("/about");
  })
});
app.post("/about/addReply", (req, res) => {
  dataServiceComments.addReply(req.body).then((data) => {
    res.redirect("/about");
  }).catch((err) => {
    console.log(err);
    res.redirect("/about");
  })
});
app.get("/login", (req, res) => {
  res.render("login");
})
app.get("/register", (req, res) => {
  res.render("register");
})
app.post("/register", (req, res) => {
  dataServiceAuth.registerUser(req.body).then(() => {
    res.render("register", { successMessage: "User created" });
  }).catch((err) => {
    res.render("register", { errorMessage: err, user: req.body.user });
  })
})
app.post("/login", (req, res) => {
  dataServiceAuth.checkUser(req.body).then(() => {
    
    req.session.user = {
      username: req.body.user,
    };
    res.redirect("/employees");
  }).catch((err) => {
    res.render("login", { errorMessage: err, user: req.body.user });
  })
})
app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
})

// send a status code and a message when going to a route that's not included
app.use(function (req, res) {
  res.status(404);
  res.send("Page Not found");
});

// setup http server to listen on HTTP_PORT
service.initialize()
  .then(dataServiceComments.initialize())
  .then(dataServiceAuth.initialize())
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart);
  }).catch((err) => {
    console.log(err);
  })



