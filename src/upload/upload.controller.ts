import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
// Import necessary decorators and services from NestJS and Swagger

@ApiTags('upload') // This adds a tag for Swagger documentation
@Controller('upload') // This sets the base route: /upload
export class UploadController {
  constructor(private readonly uploadService: UploadService) {} 
  //Injects the UploadService so we can call its methods

  @Post() //This defines the POST /upload endpoint
 @UseInterceptors(FileInterceptor('file'))
  // This tells NestJS to expect a file field named "file" in the request
@ApiConsumes('multipart/form-data')
@ApiBody({
    description: 'Image file to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          // This describes the expected file input for Swagger documentation
        },
      },
    },
  })
  async postUpload(@UploadedFile() file: Express.Multer.File) {
    // This method runs when someone calls POST /upload with a file
   console.log('Received file:', file); 
    if (!file) {
      // If no file is provided, return an error
      return { error: 'No file provided' };
    }
// Checks if a file was uploaded
// If not, it returns an error message
// If a file is provided, it proceeds to upload it
// to Cloudinary using the UploadService

    const result = await this.uploadService.uploadToCloudinary(file);
    // Passes the file to the service, which uploads it to Cloudinary and returns the result (like the file URL) 
    return { url: result.url };
    // Returns JSON with the uploaded file’s URL
  }
}
