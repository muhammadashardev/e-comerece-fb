const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { addtocart, getcart, updatequantity, removefromcart } = require('../controllers/Cartcontroller');

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.post('/add', addtocart);
router.get('/', getcart);
router.patch('/update-quantity', updatequantity);
router.delete('/remove/:productId', removefromcart);

module.exports = router;
