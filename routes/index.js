var express = require("express");
var router = express.Router();

const Collection = require("../models/Collection");

const { body, validationResult } = require("express-validator");

const async = require("async");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Taka" });
});

router.get("/manga/:title", function (req, res, next) {
  const user = req.user.username;
  res.render("manga", user);
});

router.post("/manga/:title", [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const collection = new Collection({
      title: req.body.title,
      author: req.user.username,
    });

    if (!errors.isEmpty()) {
      // Get all authors and genres for form.
      async.parallel((err, results) => {
        if (err) {
          return next(err);
        }
        res.render("manga", {
          title,
          author,
          createdAt,
          errors: errors.array(),
        });
      });
      return;
    }

    // Data from form is valid. Save statue update.
    collection.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/users/profile");
    });
  },
]);

router.get("/search/popular", function (req, res, next) {
  res.render("popular", { title: "Popular" });
});

router.get("/search/trending", function (req, res, next) {
  res.render("trending", { title: "Trending" });
});

router.get("/search/staff", function (req, res, next) {
  res.render("staff", { title: "Staff Favorites" });
});

module.exports = router;
