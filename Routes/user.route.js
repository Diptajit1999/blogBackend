const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../Models/logout.model");

require("dotenv").config();
userRouter.post("/register",  (req, res) => {
  
  const { username, email, password} = req.body;

console.log(req.body)
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      // console.log(err)
      if (err) {
        res.status(200).send({ msg: "error has occured in hashing" });
      } else {
        const user = new UserModel({ username, email, password: hash });
        await user.save();
        res.status(200).send(user);
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});


userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(email, password);
    const user = await UserModel.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        // result == true
        if (result) {
          const accessToken = jwt.sign(
            { userID: user._id, username: user.username },
            process.env.AcessKey,
            { expiresIn: 40 }
          );
          const refreshToken = jwt.sign(
            { userID: user._id, username: user.username },
            process.env.RefreshKey,
            { expiresIn: 180 }
          );
          res.send({
            msg: `user has been logged in with ${user} credential`,
            accessToken,
            refreshToken,
          });
        } else {
          res.send({ msg: `user has problem with comparing hashed password` });
        }
      });
    } else {
      res.status(200).send({ msg: "user has given wrong credentials" });
    }
  } catch (error) {
    res.send({ msg: `login has failed ${error.message}` });
  }
});

userRouter.post("/logout", async (req, res) => {
  console.log(req.headers.authorization?.split(" ")[1]);
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const oldBlackListed = await BlackListModel.findOne({
      blackList_token: token,
    });
    if (oldBlackListed) {
      return res.send({
        msg: "you have been logged out once before please login",
      });
    }
    const blackListed = new BlackListModel({ blackList_token: token });
    await blackListed.save();
    res.send({ msg: "you have logged out" });
  } catch (error) {
    res.status(200).send({ msg: error.message });
  }
});
module.exports = {
  userRouter,
};
