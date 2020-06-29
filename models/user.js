const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
       userName :{
           type: String,
           unique: true
       },
       password:{
           type: String
       },
       email: String,
       firstName: String,
       lastName: String,
       email: String,
       profilePicture: String,
       batches: {
            type: [{
            type: Schema.Types.ObjectId,
            ref: 'Batch'}]
            }
    },
     {
       timestamps: true 
    }
)

const User = mongoose.model("User", userSchema);
module.exports = User;