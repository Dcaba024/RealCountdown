var mongoose    = require("mongoose");

//SCHEMA SETUP  
var homeSchema = new mongoose.Schema({
    address: String,
    Image: String,
   // homeOwner: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Home", homeSchema);