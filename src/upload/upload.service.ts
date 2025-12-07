import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
// Import necessary modules: Injectable from NestJS, Cloudinary SDK, and filesystem module

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }
  // Configure Cloudinary with credentials from environment variables
  // This setup is done in the constructor of the service

 
  async uploadToCloudinary(file: Express.Multer.File) {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'nest_uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      ).end(file.buffer); // ✅ use buffer instead of file.path
    });
         return { url: (result as any).secure_url };
    } catch (error) {
      throw new Error('Cloudinary upload failed: ' + error.message);
    }
    // Handles any errors that occur during the upload process
  }
}

