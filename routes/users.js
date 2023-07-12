var express = require("express");
var router = express.Router();

const Collection = require("../models/Collection");

/* GET users listing. */
router.get("/profile", function (req, res, next) {
  const user = req.user.username;
  Collection.find({}, "title author createdAt")
    .sort({ createdAt: -1 })
    .exec(function (err, list_collections) {
      if (err) {
        return next(err);
      }
      res.render("profile", {
        collection_list: list_collections,
        user,
      });
    });
});

router.get("/profile/current", function (req, res, next) {
  const user = req.user.username;
  res.render("current", {
    user,
  });
});

router.get("/profile/finished", function (req, res, next) {
  const user = req.user.username;
  res.render("finished", {
    user,
  });
});

router.get("/profile/plan", function (req, res, next) {
  const user = req.user.username;
  res.render("plan", {
    user,
  });
});

router.get("/profile/favorites", function (req, res, next) {
  const user = req.user.username;
  res.render("favorites", {
    user,
  });
});

module.exports = router;
