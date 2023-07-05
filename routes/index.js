var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Taka" });
});

router.get("/manga/:title", function (req, res, next) {
  res.render("manga", { title: "Taka" });
});

router.get("/manga/popular", function (req, res, next) {
  res.render("popular", { title: "Taka" });
});

router.get("/manga/trending", function (req, res, next) {
  res.render("manga", { title: "Taka" });
});

module.exports = router;
