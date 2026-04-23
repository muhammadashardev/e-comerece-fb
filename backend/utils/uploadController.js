// This controller handles both single (req.file) and multiple (req.files) uploads
exports.uploadImages = (req, res) => {
    try {
        // Handle Multiple Files
        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map(file => file.path);
            return res.status(200).json({
                status: 'success',
                message: 'Multiple images uploaded successfully!',
                results: req.files.length,
                data: {
                    imageUrls: imageUrls,
                    files: req.files
                }
            });
        }

        // Handle Single File
        if (req.file) {
            return res.status(200).json({
                status: 'success',
                message: 'Single image uploaded successfully!',
                data: {
                    imageUrl: req.file.path,
                    file: req.file
                }
            });
        }

        // If neither exists
        return res.status(400).json({
            status: 'fail',
            message: 'No file(s) uploaded, please provide an image.'
        });

    } catch (error) {
        console.error('UPLOAD ERROR:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error during upload.'
        });
    }
};
