const mongoose = require("mongoose");

const user = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String },
  photo:{type:String},
  phone: {
  type: String,
  default: null
},
status: { type: String, default: "active" } 
});


module.exports =   mongoose.models.User || mongoose.model("User", user);
