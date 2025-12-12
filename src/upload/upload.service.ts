import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  async uploadToCloudinary(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file || !file.buffer) {
      this.logger.error('No file buffer found');
      throw new InternalServerErrorException('Invalid file upload');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error: any, result?: UploadApiResponse) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error);
            reject(new InternalServerErrorException('Cloudinary upload failed'));
          } else {
            this.logger.log(`Upload successful: ${result.secure_url}`);
            resolve({ url: result.secure_url }); // ✅ use secure_url
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
