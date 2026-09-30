const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes in this router require authentication

router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
