var express = require("express");
var router = express.Router();
const multer = require("multer");

const About = require("../models/About");
const User = require("../models/User");
const Status = require("../models/Status");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const async = require("async");
const he = require("he");

//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const user = req.user.username;
    cb(null, `${file.fieldname}-${user}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "png") {
    cb(null, true);
  } else {
    cb(new Error("Not a .PNG File!!"), false);
  }
};

//Calling the "multer" Function
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

/* GET users listing. */
router.get(
  "/profile",
  asyncHandler(async (req, res, next) => {
    const user = req.user;
    console.log(user.profilePicture);

    const list_manga = user.manga.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    const [list_about, list_status] = await Promise.all([
      About.find().sort({ createdAt: -1 }).limit(1).exec(),
      Status.find().sort({ createdAt: -1 }).limit(3).exec(),
    ]);
    res.render("profile", {
      about_list: list_about,
      status_list: list_status,
      user,
      list_manga,
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

router.get("/profile/list", async function (req, res, next) {
  const user = req.user;
  const list_manga = user.manga.sort((a, b) => a.title.localeCompare(b.title));

  res.render("list", {
    user,
    manga_list: list_manga,
  });
});

router.get(
  "/profile/activity",
  asyncHandler(async (req, res, next) => {
    const user = req.user;

    const [list_status] = await Promise.all([
      Status.find().sort({ createdAt: -1 }).limit(10).exec(),
    ]);
    res.render("activity", {
      status_list: list_status,
      user,
    });
  })
);

router.get("/settings", function (req, res, next) {
  const user = req.user.username;
  const created = req.user.createdAt;

  res.render("settings", { user, created });
});

router.post("/settings", [
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
    const about = new About({
      content: decodedText,
      author: req.body.author,
    });

    if (!errors.isEmpty()) {
      // Get all authors and genres for form.
      async.parallel((err, results) => {
        if (err) {
          return next(err);
        }
        res.render("settings", {
          author: author.username,
          content: content,
          about,
          errors: errors.array(),
        });
      });
      return;
    }

    // Data from form is valid. Save statue update.
    about.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/users/settings");
    });
  },
]);

router.get("/profile-picture", (req, res) => {
  const user = req.user.username;
  const id = req.user.id;
  const picture = req.user.profilePicture;
  User.findOne({ username: user }, "profilePicture").exec(function (
    err,
    profilePicture
  ) {
    if (err) {
      return next(err);
    }
    res.render("picture", { user, id, picture, profilePicture });
  });
});

router.post(
  "/profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const username = req.user.username;

      const user = await User.findById(userId);
      user.profilePicture = username.toLowerCase();
      await user.save();

      res.redirect("/users/settings");
    } catch (error) {
      res.status(500).json({
        error: "An error occurred while uploading the profile picture",
      });
    }
  }
);

router.get("/banner-picture", (req, res) => {
  const user = req.user.username;
  const id = req.user.id;
  User.findOne({ username: user }, "bannerPicture").exec(function (err) {
    if (err) {
      return next(err);
    }
    res.render("banner", { user, id, picture });
  });
});

router.post(
  "/banner-picture",
  upload.single("bannerPicture"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId);
      await user.save();

      res.redirect("/users/settings");
    } catch (error) {
      res.status(500).json({
        error: "An error occurred while uploading the profile picture",
      });
    }
  }
);

module.exports = router;
