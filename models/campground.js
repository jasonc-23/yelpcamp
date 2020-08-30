var mongoose = require('mongoose');

// Set up schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Comment"
        }
    ]
});
// Turn schema into a model which mongoose recognizes so we can use methods like create, find, save, etc.
module.exports = mongoose.model("Campground", campgroundSchema);