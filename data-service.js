var fs = require("fs");

var employees = [];
var departments = [];

module.exports.initialize = function(){
    var loadError = false;

    fs.readFile('./data/employees.json', 'utf8', (err, data) => {
        if (err) loadError = true;
        else employees = JSON.parse(data);
    });
    
    fs.readFile('./data/departments.json', 'utf8', (err, data) => {
        if (err) loadError = true;
        else departments = JSON.parse(data);
    }); 

    return new Promise(function(resolve, reject){
        setTimeout(function(){
            if (loadError) reject();
            else resolve("Has been resolved");
        }, 1000);
    })

}

module.exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
        if(employees.length == 0) reject("No results returned.");
        else {
            setTimeout(function(){
                resolve(employees);
            }, 1000)
        }
    })
}

module.exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            if(employees.length == 0) reject("No results returned.");

            else {
                var holder = [];
                for (var i = 0; i < employees.length; i++){
                        if(employees[i].status == status)
                            holder.push(employees[i]);
                }
                (holder.length != 0) ? resolve(holder) : reject("No results returned.");
            }
        }, 1000) 
    })
}
module.exports.getEmployeesByDepartment = function(department){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            if(employees.length == 0) reject("No results returned.");

            else {
                var holder = [];
                for (var i = 0; i < employees.length; i++){
                        if(employees[i].department == department)
                            holder.push(employees[i]);
                }
                (holder.length != 0) ? resolve(holder) : reject("No results returned.");
            }
        }, 1000) 
    })
}
module.exports.getEmployeesByManager = function(manager){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            if(employees.length == 0) reject("No results returned.");

            else {
                var holder = [];
                for (var i = 0; i < employees.length; i++){
                        if(employees[i].employeeManagerNum == manager)
                            holder.push(employees[i]);
                }
                (holder.length != 0) ? resolve(holder) : reject("No results returned.");
            }
        }, 1000) 
    })
}
module.exports.getEmployeeByNum = function(num){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            if(employees.length == 0) reject("No results returned.");

            else {
                for (var i = 0; i < employees.length; i++){
                        if(employees[i].employeeNum == num)
                            resolve(employees[i]);
                }
            }
        }, 1000) 
    })
}
module.exports.getManagers = function(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            if(employees.length == 0) reject("No results returned.");

            else {
                var holder = [];
                for (var i = 0; i < employees.length; i++){
                        if(employees[i].isManager == true)
                            holder.push(employees[i]);
                }
                resolve(holder);
            }
        }, 1000) 
    })
}
module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            if(departments.length == 0) reject("No results found.");
            else resolve(departments);
        },1000)
    })
}

