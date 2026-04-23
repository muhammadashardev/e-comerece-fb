const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { togglewishlist, getwishlist, removefromwishlist } = require('../controllers/Wishlistcontroller');

const router = express.Router();

// All wishlist routes are protected
router.use(protect);

router.post('/toggle', togglewishlist);
router.get('/', getwishlist);
router.delete('/remove/:productId', removefromwishlist);

module.exports = router;
