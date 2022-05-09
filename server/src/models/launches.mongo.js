const mongoose = require("mongoose");

const launchesSchema = mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
    max: 200,
  },
  launchDate: Date,
  mission: String,
  rocket: String,
  // target: {
  //   type:mongoose.ObjectId,
  //   ref:"Planet"
  // },
  target:String,
  customers: [String],
  upcoming: Boolean,
  success:String,
});


module.exports = mongoose.model('Launches',launchesSchema)