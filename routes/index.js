var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Taka" });
});

router.get("/manga/:title", function (req, res, next) {
  res.render("manga", { title: "Taka" });
});

router.get("/search/popular", function (req, res, next) {
  res.render("popular", { title: "Popular" });
});

router.get("/search/trending", function (req, res, next) {
  res.render("trending", { title: "Trending" });
});

router.get("/search/staff", function (req, res, next) {
  res.render("trending", { title: "Staff Favorites" });
});

module.exports = router;
