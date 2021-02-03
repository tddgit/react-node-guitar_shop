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
const { Wood } = require("./models/wood");
const { Brand } = require("./models/brand");
const { Product } = require("./models/product");

//============MIDDLEWARE=====================

//===========================================
//              PRODUCTS
//===========================================

// By Sell
// /articles?sortBy=sold&order=desc&limit=4
//BY ARRIVAL
// /articles?sortBy=createdAt&order=desc&limit=4

app.get("/api/product/articles", (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  Product.find()
    .populate("brand")
    .populate("wood")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, articles) => {
      if (err) return res.status(400).send(err.message);
      res.send(articles);
    });
});

app.get("/api/product/articles_by_id", (req, res) => {
  const type = req.query.type;
  let items = req.query.id;
  if (type === "array") {
    const ids = req.query.id.split(",");
    items = [];
    items = ids.map((item) => {
      return mongoose.Types.ObjectId(item);
    });
  }
  console.log(items);
  Product.find({ _id: { $in: items } })
    .populate("brand")
    .populate("wood")
    .exec((err, docs) => {
      return res.status(200).send(docs);
    });
});

app.post("/api/product/article", auth, admin, (req, res) => {
  const product = new Product(req.body);
  product.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true,
      article: doc,
    });
  });
});

//===========================================
//              WOODS
//===========================================

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
