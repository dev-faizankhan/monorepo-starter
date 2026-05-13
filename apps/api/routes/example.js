const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from the example route" });
});

router.post("/", (req, res) => {
  res.status(201).json({ received: req.body });
});

module.exports = router;
