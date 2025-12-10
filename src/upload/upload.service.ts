import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor() {
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  async uploadToCloudinary(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file || !file.buffer) {
      throw new HttpException('No file buffer received', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'nest_uploads' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          },
        ).end(file.buffer);
      });

      return { url: (result as any).secure_url };
    } catch (error) {
      console.error('Upload failed:', error);
      throw new HttpException(
        'Cloudinary upload failed: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
