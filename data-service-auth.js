const bcrypt = require('bcryptjs');
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
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(userData.password, salt, function (err, hash) {
                    if (err)
                        reject("There was an error encrypting the password");
                    else {
                        userData.password = hash;
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
                });
            });

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
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(userData.password, salt, function (err, hash) {
                        bcrypt.compare(userData.password, data[0].password).then((res) => {
                            if (res === true) {
                                resolve();
                            }
                            else {
                                reject("Wrong password for user: " + data[0].user);
                            }
                        });
                    });
                });
            }).catch((err) => {
                reject("Unable to find the user: " + userData.user);
            })
    })
}
module.exports.updatePassword = function (userData) {
    return new Promise((resolve, reject) => {
        if (userData.password == userData.password2) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(userData.password, salt, function (err, hash) {
                    User.update({ user: userData.user },
                        { $set: { password: hash } },
                        { multi: false })
                        .exec()
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            reject("There was an error updating the password for " + userData.user);
                        });
                });
            });
        }
        else 
            reject("Your new passwords do not match");

    });
}