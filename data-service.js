const Sequelize = require('sequelize');
var sequelize = new Sequelize('db1uv67glvpsgd', 'zmbplreuxcxmck', '60f3401ef3f6045f8c33c089c5f1de6c6cfdf167e022d3d085724f3bfb275bd2', {
    host: 'ec2-23-21-246-11.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});
var Employees = sequelize.define('Employee', {
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
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: {
        type: Sequelize.INTEGER,
        defaultValue: null
    },
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
})
var Departments = sequelize.define('Department', {
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
    return new Promise(function (resolve, reject) {
        Employees.findAll().then((data) => {
            resolve(data);
        }).catch(() => {
            reject("No results found.");
        })
    })
}

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where: {
                status: status
            }
        }).then((data) => {
            resolve(data)
        }).catch(() => {
            reject("No results returned.");
        })
    })
}
module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where: {
                department: department
            }
        }).then((data) => {
            resolve(data)
        }).catch(() => {
            reject("No results returned.");
        })
    })
}
module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then((data) => {
            resolve(data)
        }).catch(() => {
            reject("No results returned.");
        })
    })
}
module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where: {
                employeeNum: num
            }
        }).then((data) => {
            resolve(data[0])
        }).catch(() => {
            reject("No results returned.");
        })
    })
}
module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where: {
                isManager: true
            }
        }).then((data) => {
            resolve(data)
        }).catch(() => {
            reject("No results returned.");
        })
    })
}
module.exports.getDepartments = function () {
    return new Promise(function (resolve, reject) {
        Departments.findAll().then((data) => {
            resolve(data)
        }).catch(() => {
            reject("No results returned.");
        })
    })
}
module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if(employeeData[prop] == '')
                employeeData[prop] = null;
        }
        Employees.create({
            firstName: employeeData.firstName,
            last_Name: employeeData.last_Name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity:employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(() => {
            resolve("Employee created.");
        }).catch(() => {
            reject("Unable to create employee.");
        })
    })
}
module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var prop in employeeData) {
            if(employeeData[prop] == '')
                employeeData[prop] = null;
        }
        Employees.update({
            firstName: employeeData.firstName,
            last_Name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity:employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }, {
            where:{
                employeeNum: employeeData.employeeNum
            }
        }).then(() => {
            resolve("Updated employee");
        }).catch(() => {
            reject("Unable to update employee");
        })
    })
}
module.exports.addDepartment = function(departmentData){
    return new Promise(function (resolve, reject) {
        for (var prop in departmentData) {
            if(departmentData[prop] == '')
                departmentData[prop] = null;
        }
        Departments.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }).then(() => {
            resolve("Department created.");
        }).catch(() => {
            reject("Unable to create department.");
        })
    })
} 
module.exports.updateDepartment = function(departmentData){
    return new Promise(function(resolve, reject) {
    for (var prop in departmentData) {
            if(departmentData[prop] == '')
                departmentData[prop] = null;
        }
        Departments.update({
            departmentName: departmentData.departmentName
        }, {
        where: {
            departmentId: departmentData.departmentId
        }
        }).then(() => {
            resolve("Updated department");
        }).catch(() => {
            reject("Unable to update department");
        })
    })
}
module.exports.getDepartmentById = function(id){
    return new Promise(function (resolve, reject) {
        Departments.findAll({
            where: {
                departmentId: id
            }
        }).then((data) => {
            resolve(data[0])
        }).catch(() => {
            reject("No results returned.");
        })
    })
}
module.exports.deleteEmployeeByNum = function(empNum){
    return new Promise(function(resolve,reject) {
        Employees.destroy({
            where:{
                employeeNum: empNum
            }
        }).then(() => {
            resolve("Employee destroyed");
        }).catch(() => {
            reject("Unable to destroy employee");
        })
    })
}