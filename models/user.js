var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email:  String,
    image: String,
    countdown: Number,
    expiredDate: String,
    isAgent: {type: Boolean, default: false},
    isBuyer: {type: Boolean, default: false},
    bids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bid"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);