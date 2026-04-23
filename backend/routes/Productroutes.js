const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { createproduct,getproduct,getproductbyid,updateproduct,deleteproduct,searchProduct } = require('../controllers/Productcontroller');

const router = express.Router();

// Diagnostic route
router.get('/search/:query', searchProduct);
router.get('/test', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Product API is online and reachable' });
});

router.post('/createproduct', authMiddleware.protect, authMiddleware.restrictTo('admin'), upload.single('image'), createproduct);
router.get('/getproduct',getproduct)
router.get('/getproductbyid/:id',getproductbyid)
router.put('/updateproduct/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), upload.single('image'), updateproduct)
router.delete('/deleteproduct/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), deleteproduct)




module.exports=router; 