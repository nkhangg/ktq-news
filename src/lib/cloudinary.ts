import { v2 as cloudinary } from 'cloudinary';

const FOLDER_NAME = 'ktq-news/medias';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImage = async (filePath: string) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: FOLDER_NAME,
        });
        return result;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const uploadFromUrl = async (imageUrl: string) => {
    try {
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: FOLDER_NAME,
        });
        return result;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export async function deleteImage(publicId: string, resource_type = 'image') {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { invalidate: true, resource_type });
        return result;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}

export default cloudinary;
