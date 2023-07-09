var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/profile", function (req, res, next) {
  const user = req.user.username;
  res.render("profile", { title: "Taka", user });
});

module.exports = router;
