const express = require("express");
const router = express.Router();

// Temporary test routes
router.post("/register", (req, res) => {
  res.send("✅ Register route is working!");
});

router.post("/login", (req, res) => {
  res.send("✅ Login route is working!");
});

module.exports = router;   // ✅ Important: export router
