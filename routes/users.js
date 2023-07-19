var express = require("express");
var router = express.Router();

const Collection = require("../models/Collection");
const Status = require("../models/Status");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const async = require("async");
const he = require("he");

/* GET users listing. */
router.get(
  "/profile",
  asyncHandler(async (req, res, next) => {
    const user = req.user.username;

    const [list_collections, list_status] = await Promise.all([
      Collection.find().exec(),
      Status.find().exec(),
    ]);
    res.render("profile", {
      collection_list: list_collections,
      status_list: list_status,
      user,
    });
  })
);

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

router.get("/profile/current", async function (req, res, next) {
  const user = req.user.username;
  const current = await Collection.find({
    status: "current",
  }).exec();

  res.render("current", {
    user,
    current,
  });
});

router.get("/profile/finished", async function (req, res, next) {
  const user = req.user.username;
  const finish = await Collection.find({
    status: "finish",
  }).exec();

  res.render("finished", {
    user,
    finish,
  });
});

router.get("/profile/plan", async function (req, res, next) {
  const user = req.user.username;
  const plan = await Collection.find({
    status: "plan",
  }).exec();

  res.render("plan", {
    user,
    plan,
  });
});

router.get("/profile/favorites", async function (req, res, next) {
  const user = req.user.username;
  const favorite = await Collection.find({
    favorite: true,
  }).exec();

  res.render("favorites", {
    user,
    favorite,
  });
});

module.exports = router;
