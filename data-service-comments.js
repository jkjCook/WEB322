const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var contentSchema = new Schema({
    "authorName": String,
    "authorEmail": String,
    "subject": String,
    "commentText": String,
    "postedDate": Date,
    "replies": [{
        "comment_id": String,
        "authorName": String,
        "authorEmail": String,
        "commentText": String,
        "repliedDate": Date
    }]

});

let Comment;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb://jcook17:zxcvbnm123@ds163672.mlab.com:63672/web322_a6");
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            Comment = db.model("comments", contentSchema);
            resolve();
        });
    });
}

module.exports.addComment = function(data){
    return new Promise(function(resolve,reject) {
        data.postedDate = Date.now();
        let newComment = Comment(data);
        newComment.save((err) => {
            if(err)
                reject("There was an error saving the comment: " + err);
            else 
                resolve(newComment._id);
        })
    });
}

module.exports.getAllComments = function(){
    return new Promise(function(resolve, reject) {
        Comment.find()
        .sort({
            postedDate: 1
        })
        .exec()
        .then((data) =>{
            resolve(data);
        }).catch((err) =>{
            reject("There was an error getting all comments: " + err);
        })
    })
}
module.exports.addReply = function(data){
    return new Promise(function(resolve,reject){
        data.repliedDate = Date.now();
        Comment.update({
            _id: data.comment_id
        },  { 
            $addToSet: { replies: data } 
        })
        .exec()
        .then(() =>{
            resolve();
        }).catch((err) =>{
            reject("There was an error adding reply: " + err);
        })
    })
}