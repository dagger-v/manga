var express = require("express");
var router = express.Router();

const User = require("../models/User");

const data = require("../data");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Taka", data });
});

router.get("/manga/:title", async function (req, res, next) {
  const bookId = parseInt(req.params.title);
  const book = data.PopularManga.find((book) => book.id === bookId);
  res.render("manga", { book });
});

router.post("/manga/:title", async (req, res, next) => {
  const bookId = parseInt(req.params.title);
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const existingBook = user.manga.find(
      (book) => book.title === req.body.title
    );

    if (existingBook) {
      return res.redirect(`/manga/${bookId}`);
    }

    const newBook = {
      title: req.body.title,
      image: req.body.image,
    };

    user.manga.push(newBook);

    await user.save();

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error adding book");
  }
});

router.get("/character/:character", function (req, res, next) {
  const characterId = parseInt(req.params.character);
  const bookWithCharacter = data.PopularManga.find((book) =>
    book.characters.some((character) => character.id === characterId)
  );

  if (!bookWithCharacter) {
    //if ID is not found in any book
    return res.status(404).send("Character not found");
  }

  //find the specific character within the book
  const character = bookWithCharacter.characters.find(
    (char) => char.id === characterId
  );
  res.render("character", { character });
});

module.exports = router;
