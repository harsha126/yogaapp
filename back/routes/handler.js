const express = require("express");
const { Schema } = require("mongoose");
const router = express.Router();
const Schemas = require("../models/Schemas.js");
let loggedInUser = null;

router.post("/signup", async (req, res) => {
  const { username, password, Age: age } = req.body;
  const newUser = new Schemas.Users({
    username,
    password,
    age,
    haspaid: false,
    lastpaiddate: new Date(),
    batch: null,
  });
  const users = Schemas.Users;
  try {
    const existingUser = await users.findOne({ username: username }).exec();
    if (existingUser != null) {
      res.status(400);
      res.end("already exists");
    } else {
      await newUser.save(async (err, newUserResult) => {
        loggedInUser = newUserResult;
        res.status(200).json(newUserResult);
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.status(400);
    res.end("please enter valid credentails");
    return;
  }
  const users = Schemas.Users;
  try {
    const existingUser = await users
      .findOne({ username: username, password: password })
      .exec();
    if (existingUser === null) {
      res.status(400);
      res.end("please enter valid credentails");
    } else {
        console.log(existingUser);
      res.status(200).json(existingUser);
      loggedInUser = existingUser;
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/update", (req, res) => {
    const users = Schemas.Users;
    users.findOneAndUpdate(
        {username:req.body.username},
        {$set:{batch:req.body.batch,lastpaiddate:new Date(),haspaid:true}},
        {new : true},
        (err,user) =>{
            if(err){
                console.log(err);
            }
            else{
                console.log(user);
                res.status(200).json(user);
            }
        }
    )
});

module.exports = router;
