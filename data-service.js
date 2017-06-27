const Sequelize = require('sequelize');
var sequelize = new Sequelize('db1uv67glvpsgd', 'zmbplreuxcxmck', '60f3401ef3f6045f8c33c089c5f1de6c6cfdf167e022d3d085724f3bfb275bd2', {
 host: 'ec2-23-21-246-11.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: true
 }
});
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_Name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,    
})
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
})
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve("Connected to the Database");
        }).catch(() => {
            reject("Database connection failed");
        })
});
}

module.exports.getAllEmployees = function () {
    return new Promise( function(resolve, reject) {
        reject();
    })
}

module.exports.getEmployeesByStatus = function (status) {
    return new Promise( function(resolve, reject) {
        reject();
    })
}
module.exports.getEmployeesByDepartment = function (department) {
    return new Promise( function(resolve, reject) {
        reject();
    })
}
module.exports.getEmployeesByManager = function (manager) {
    return new Promise( function(resolve, reject) {
        reject();
    })
}
module.exports.getEmployeeByNum = function (num) {
    return new Promise( function(resolve, reject) {
        reject();
    })
}
module.exports.getManagers = function () {
    return new Promise( function(resolve, reject) {
        reject();
    })
}
module.exports.getDepartments = function () {
    return new Promise( function(resolve, reject) {
        reject();
    })
}
module.exports.addEmployee = function (employeeData) {
    return new Promise( function(resolve, reject) {
        reject();
    })
}
module.exports.updateEmployee = function(employeeData){
    return new Promise( function(resolve, reject) {
        reject();
    })
} 
