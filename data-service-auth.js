const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var userSchema = new Schema({
    "user": { type: String, unique: true, required: true },
    "password": String

});

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://jcook:zxcvbnm123@ds159497.mlab.com:59497/web322_a7");
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
}

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password == userData.password2) {
            let newUser = new User(userData);
            newUser.save((err) => {
                if (err)
                    if (err.code == 11000)
                        reject("Username already taken.");
                    else
                        reject("There was an error creating the user: " + err);
                else
                    resolve();
            })
        }
        else 
            reject("Passwords do not match");
    })
}

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.find({ user: userData.user })
            .exec()
            .then((data) => {
                if (data[0].user == "") {
                    reject("Unable to find user: " + userData.user);
                }
                if (data[0].password != userData.password) {
                    reject("Incorrect password for user " + userData.user);
                }
                if (data[0].password == userData.password) {
                    resolve();
                }
            }).catch((err) => {
                reject("Unable to find the user: " + userData.user);
            })
    })
}
