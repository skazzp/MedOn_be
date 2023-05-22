import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'ChatMessage in chat',
    example: 'Hello',
  })
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    description: 'Appointment identifier',
    example: '32',
  })
  @IsNumber()
  @IsNotEmpty()
  appointmentId: number;

  @ApiProperty({
    description: 'Sender identifier',
    example: '32',
  })
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @ApiProperty({
    description: 'Recipient identifier',
    example: '32',
  })
  @IsNumber()
  @IsNotEmpty()
  recipientId: number;
}
