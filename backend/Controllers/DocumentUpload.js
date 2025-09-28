import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export const documentUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No document uploaded. Please upload a PDF file.' });
    }

    const filePath = req.file.path;

    try {
        // Upload the PDF to Cloudinary as raw
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'project_documents',
            resource_type: 'raw', // important for PDFs
        });
        console.log("Cloudinary Upload Result:", result);   
        // Delete temporary file
        fs.unlinkSync(filePath);

        // Generate a browser-friendly URL for the PDF
        const browserUrl = result.secure_url;
        
        res.status(200).json({
            success: true,
            message: 'Document uploaded successfully.',
            url: browserUrl,
            public_id: result.public_id,
        });

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);

        if (filePath) {
            try {
                fs.unlinkSync(filePath);
            } catch (unlinkError) {
                console.error("Error deleting temp file:", unlinkError);
            }
        }

        res.status(500).json({ success: false, error: error.message });
    }
};
