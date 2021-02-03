const express = require("express");
const { auth } = require("./middleware/auth");
const { admin } = require("./middleware/admin");

const cookieParser = require("cookie-parser");

const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser());

//=============MODELS========================
const { User } = require("./models/user");

//============MIDDLEWARE=====================

//===========================================
//              PRODUCTS
//===========================================

//===========================================
//              WOODS
//===========================================
const { Wood } = require("./models/wood");

app.post("/api/product/wood", auth, admin, (req, res) => {
  const wood = new Wood(req.body);
  wood.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(400).json({ success: true, wood: doc });
  });
});

app.get("/api/product/woods", auth, admin, (req, res) => {
  Wood.find({}, (err, data) => {
    if (err) return res.json({ success: false, err });
    res.status(400).json({ success: true, woodsdata: data });
  });
});

//===========================================
//              BRANDS
//===========================================

const { Brand } = require("./models/brand");

app.post("/api/product/brand", auth, admin, (req, res) => {
  const brand = new Brand(req.body);
  brand.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, error: err });
    res.status(200).json({
      success: true,
      branddata: doc,
    });
  });
});

app.get("/api/product/brands", auth, admin, (req, res) => {
  Brand.find({}, (err, brands) => {
    if (err) return res.status(400).json({ success: "Data not found", err });
    res.status(200).send(brands); //json({ status: true, brandata: brands });
  });
});
//===========================================
//              USERS
//===========================================

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    cart: req.user.cart,
    history: req.user.history,
  });
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, error: err });
    res.status(200).json({
      success: true,
      userdata: doc,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginsuccess: false,
        message: "Auth failes, email not found",
        error: err,
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginsuccess: false,
          message: "Wrong password",
          error: err,
        });
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        res
          .cookie("w_auth", user.token)
          .status(200)
          .json({ loginsuccess: true });
      });
    });
  });
});

app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ status: "logout" });
  });
});

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
