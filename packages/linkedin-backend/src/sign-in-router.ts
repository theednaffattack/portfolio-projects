import express from "express";
const router = express.Router();

// Home page route.
router.get("/", function (req, res) {
  console.log("Yoooooo");

  res.send("Wiki home page");
});

// About page route
router.get("/about", function (req, res) {
  res.send("About this wiki");
});

export { router };
