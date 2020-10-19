var mongoose = require("mongoose");

var bidSchema = new mongoose.Schema({
    rate: Number,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        image: String,
        name: String,
        phoneNumber: String
    }
});

module.exports = mongoose.model("Bid", bidSchema);