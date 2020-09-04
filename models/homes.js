var mongoose    = require("mongoose");

//SCHEMA SETUP  
var homeSchema = new mongoose.Schema({
    address: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    Image: String,
    price: Number,
    countdown: Number,
    expiredDate: String,
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