var express = require("express");
var router = express.Router();

const Collection = require("../models/Collection");
const Status = require("../models/Status");

const { body, validationResult } = require("express-validator");

const async = require("async");
const he = require("he");

/* GET users listing. */
router.get("/profile", function (req, res, next) {
  const user = req.user.username;
  Collection.find({}, "title author createdAt").sort({ createdAt: -1 });
  Status.find({}, "content author createdAt")
    .sort({ createdAt: -1 })
    .exec(function (err, list_collections, list_status) {
      if (err) {
        return next(err);
      }
      res.render("profile", {
        collection_list: list_collections,
        status_list: list_status,
        user,
      });
    });
});

router.post("/profile", [
  // Validate and sanitize fields.
  body("content", "Content must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Access the text content from the form
    const text = req.body.content;

    // Decode the text content using he library
    const decodedText = he.decode(text);

    // Create an article object with escaped and trimmed data.
    const status = new Status({
      content: decodedText,
      author: req.body.author,
    });

    if (!errors.isEmpty()) {
      // Get all authors and genres for form.
      async.parallel((err, results) => {
        if (err) {
          return next(err);
        }
        res.render("profile", {
          author: author.username,
          content: content,
          status,
          errors: errors.array(),
        });
      });
      return;
    }

    // Data from form is valid. Save statue update.
    status.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/users/profile");
    });
  },
]);

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
