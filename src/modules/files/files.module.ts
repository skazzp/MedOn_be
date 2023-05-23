import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from './files.service';

@Module({
  imports: [ConfigModule],
  providers: [FilesService],
})
export class FilesModule {}
