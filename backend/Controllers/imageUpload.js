import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const imageUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ 
            success: false, 
            message: 'No image was uploaded. Please upload one image.' 
        });
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'project_images',
        });

        fs.unlinkSync(req.file.path);

        const urls = [result.secure_url];

        return res.status(200).json({
            success: true,
            message: 'Image uploaded successfully.',
            urls: urls
        });

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);

        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error("Error deleting temp file after failed upload:", unlinkError);
            }
        }

        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

