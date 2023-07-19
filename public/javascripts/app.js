const Collection = require("../models/Collection");

const reading = document.getElementById("reading");
const plan = document.getElementById("plan");
const finished = document.getElementById("finished");
const favorite = document.getElementById("favorite");

reading.addEventListener("click", async function () {
  const request = await Collection.findById(req.params.id);
  request.status = "reading";
});

plan.addEventListener("click", async function () {
  const request = await Collection.findById(req.params.id);
  request.status = "plan";
});

finished.addEventListener("click", async function () {
  const request = await Collection.findById(req.params.id);
  request.status = "finished";
});

favorite.addEventListener("click", async function () {
  const request = await Collection.findById(req.params.id);
  const isFavorite = isFavorite ? false : true;
  request.favorite = isFavorite;
});
