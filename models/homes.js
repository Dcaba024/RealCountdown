var mongoose    = require("mongoose");

//SCHEMA SETUP  
var homeSchema = new mongoose.Schema({
    address: String,
    Image: String,
    askingRate: Number,
   // homeOwner: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    bids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bid"
        }
    ]
});

module.exports = mongoose.model("Home", homeSchema);