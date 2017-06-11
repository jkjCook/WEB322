var fs = require("fs");

var employees = [];
var departments = [];
var empCount = 0;

module.exports.initialize = function () {
    var loadError;

    fs.readFile('./data/employees.json', 'utf8', (err, data) => {
        if (err) throw new Error(err);
        else {
            employees = JSON.parse(data);
        }
    })

    fs.readFile('./data/departments.json', 'utf8', (err, data) => {
        if (err) throw new Error(err);
        departments = JSON.parse(data);
    })
    return new Promise(function (resolve, reject) {
        if (loadError) reject(loadError);
        else {
            empCount = employees.length;
            resolve("success");
        }
    })

}

module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        if (employees.length == 0) reject("No results returned.");
        else {
            resolve(employees);
        }
    })
}

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        if (employees.length == 0) reject("No results returned.");

        else {
            var holder = [];
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].status == status)
                    holder.push(employees[i]);
            }
            (holder.length != 0) ? resolve(holder) : reject("No results returned.");
        }
    })
}
module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        if (employees.length == 0) reject("No results returned.");

        else {
            var holder = [];
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].department == department)
                    holder.push(employees[i]);
            }
            (holder.length != 0) ? resolve(holder) : reject("No results returned.");
        }
    })
}
module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        if (employees.length == 0) reject("No results returned.");

        else {
            var holder = [];
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].employeeManagerNum == manager)
                    holder.push(employees[i]);
            }
            (holder.length != 0) ? resolve(holder) : reject("No results returned.");
        }
    })
}
module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        if (employees.length == 0) reject("No results returned.");
        else {
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].employeeNum == num) {
                    resolve(employees[i]);
                }
            }
            reject("No employee found.");
        }
    })
}
module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        if (employees.length == 0) reject("No results returned.");

        else {
            var holder = [];
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].isManager == true)
                    holder.push(employees[i]);
            }
            resolve(holder);
        }
    })
}
module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        if (departments.length == 0) reject("No results found.");
        else resolve(departments);
    })
}
module.exports.addEmployee = function (employeeData) {
    empCount = employees.length;
    empCount++;
    return new Promise((resolve, reject) => {
        employeeData.employeeNum = empCount;
        employees.push(employeeData);
        if(employees[empCount - 1].employeeNum == empCount){
            resolve();
        }
        else{
            reject("Wasn't added correctly");
        }

    })
}

