var express = require("express");
var router = express.Router();

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

module.exports = router;
