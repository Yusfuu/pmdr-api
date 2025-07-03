import { StorageService } from './storage.service';
import {
  Post,
  UploadedFile,
  UseInterceptors,
  Controller,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/storage.config';

@Controller('api/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('eventId') eventId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const saved = await this.storageService.saveFileInfo(
      file.filename,
      eventId,
    );
    return { message: 'File uploaded successfully', file: saved };
  }
}
