const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  creationdate: { type: Date, default: Date.now },
  age: { type: Number },
  batch: { type: Number },
  haspaid: { type: Boolean },
  lastpaiddate: { type: Date },
});

const Users = mongoose.model("users", userSchema, "users");

const mySchemas = { Users: Users };

module.exports = mySchemas;
