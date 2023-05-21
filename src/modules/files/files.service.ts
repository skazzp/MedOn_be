import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  bucketName = this.configService.get('AWS_BUCKET_NAME');

  s3 = new S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  });

  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    const newFileName = `${uuidv4()}-${filename}`;

    const uploadResult = await this.s3
      .upload({
        Bucket: this.bucketName,
        Body: dataBuffer,
        Key: `${newFileName}`,
        ACL: 'public-read',
        ContentDisposition: 'inline',
      })
      .promise();

    return newFileName;
  }

  async deletePublicFile(fileKey: string): Promise<void> {
    await this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: fileKey,
      })
      .promise();
  }
}
