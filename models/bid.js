var mongoose = require("mongoose");

var bidSchema = new mongoose.Schema({
    rate: Number,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Bid", bidSchema);