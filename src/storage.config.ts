// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import { Request } from 'express';
// import { BadRequestException } from '@nestjs/common';
// import * as mime from 'mime-types';

// import { MulterModuleOptions } from '@nestjs/platform-express';
// export const multerOptions: MulterModuleOptions = {
//   storage: diskStorage({
//     destination: './storage',
//     filename: (req, file, cb) => {
//       const ext = extname(file.originalname);
//       const filename = `${uuidv4()}${ext}`;
//       cb(null, filename);
//     },
//   }),
//   fileFilter: (
//     _: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, acceptFile: boolean) => void,
//   ) => {
//     const mimeType = mime.lookup(file.originalname);
//     if (mimeType && mimeType.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new BadRequestException('Only image files are allowed'), false);
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 },
// };
