const plan = document.getElementById("plan");

plan.addEventListener("click", async function () {
  const request = await Collection.findById(req.params.id);
  request.status = "plan";
});
