import { MulterModuleOptions } from '@nestjs/platform-express';
import * as multer from 'multer';

export const multerConfig: MulterModuleOptions = {
  storage: multer.memoryStorage(), // keep file in memory buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
};
storage: multer.memoryStorage()
