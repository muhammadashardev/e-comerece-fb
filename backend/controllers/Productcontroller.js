const mongoose =require("mongoose");
const Products =require( "../models/Productmodel");

exports.createproduct = async (req, res) => {
    try {
        console.log('--- PRODUCT CREATE ATTEMPT ---');
        
        const body = req.body || {};
        const file = req.file;

        console.log('--- REQUEST DATA ---');
        console.log('Headers:', req.headers['content-type']);
        console.log('Received Body Fields:', Object.keys(body));
        if (file) {
            console.log('Received File Detail:', {
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: `${(file.size / 1024).toFixed(2)} KB`,
                path: file.path // Should be Cloudinary URL
            });
        } else {
            console.log('Received File: NONE (Check if "image" field is used in Postman)');
        }

        const { title, description, price, category, stock, rating, numReviews } = body;

        // 1. Manual Validation
        const errors = [];
        if (!title) errors.push('title');
        if (!description) errors.push('description');
        if (!price) errors.push('price');
        if (!category) errors.push('category');
        if (!stock) errors.push('stock');
        if (!rating) errors.push('rating');
        if (!numReviews) errors.push('numReviews');
        if (!file) errors.push('image file');

        if (errors.length > 0) {
            console.log('Validation Failed:', errors.join(', '));
            return res.status(400).json({
                status: 'fail',
                message: `Missing required fields: ${errors.join(', ')}`,
                details: errors
            });
        }

        // 2. Prepare Data
        const productData = {
            title,
            description,
            price: parseFloat(price) || 0,
            category,
            stock: parseInt(stock) || 0,
            rating: parseFloat(rating) || 0,
            numReviews: parseInt(numReviews) || 0,
            image: file.path,
            user: req.user ? req.user._id : "65f1a2b3c4d5e6f7a8b9c0d1"
        };

        console.log('Saving product with data:', JSON.stringify(productData, null, 2));

        const product = new Products(productData);
        await product.save();

        console.log('Product saved successfully!');

        res.status(201).json({
            status: 'success',
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error('CRITICAL CONTROLLER ERROR:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Unknown Controller Error',
            stack: error.stack
        });
    }
};

exports.getproduct =async(req,res)=>{
    const prodcts=await Products.find()
    if(!prodcts){
        res.status(404).json({
            status:'fail',
            message:'No products found'
        })
    }
    res.status(200).json({
        status:'success',
        message:'Products fetched successfully',
        data:prodcts
    })
}

exports.getproductbyid=async(req,res)=>{
    const productbyid= await Products.findById(req.params.id)
    if(!productbyid){
        res.status(404).json({
            status:'fail',
            message:'No product found'
        })
    }
    res.status(200).json({
        status:'success',
        message:'Product fetched successfully',
        data:productbyid
    })
}
exports.updateproduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};

        // Define fields that can be updated
        const fields = ['title', 'description', 'price', 'category', 'stock', 'rating', 'numReviews'];

        // Only add fields that are present in req.body
        fields.forEach(field => {
            if (req.body[field] !== undefined && req.body[field] !== null) {
                // Parse numeric fields if they exist
                if (['price', 'rating'].includes(field)) {
                    updateData[field] = parseFloat(req.body[field]);
                } else if (['stock', 'numReviews'].includes(field)) {
                    updateData[field] = parseInt(req.body[field]);
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        // Add image if a new file was uploaded
        if (req.file) {
            updateData.image = req.file.path;
        }

        console.log(`Updating product ${id} with:`, updateData);

        const updatedProduct = await Products.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                status: 'fail',
                message: 'No product found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: updatedProduct
        });

    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error updating product'
        });
    }
};
exports.deleteproduct=async(req,res)=>{
    const deleteproduct= await Products.findByIdAndDelete(req.params.id)
    if(!deleteproduct){
        res.status(404).json({
            status:'fail',
            message:'No product found'
        })
    }
    res.status(200).json({
        status:'success',
        message:'Product deleted successfully',
        data:deleteproduct
    })
}

exports.searchProduct = async (req, res) => {
    try {
        const { query } = req.params;
        
        if (!query) {
            return res.status(400).json({
                status: 'fail',
                message: 'Search query is required'
            });
        }

        // Case-insensitive regex search on the title field
        const products = await Products.find({
            title: { $regex: query, $options: 'i' }
        });

        res.status(200).json({
            status: 'success',
            message: `Found ${products.length} products matching "${query}"`,
            data: products
        });

    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error searching for products'
        });
    }
};



