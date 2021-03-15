import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Message {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Message bot id',
    type: String,
    required: true,
  })
  botId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Message text',
    type: String,
    required: true,
  })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Message conversation id',
    type: String,
    required: true,
  })
  conversationId: string;
}

export class AIIntent {
  @ApiProperty({
    description: 'Intent name',
    type: String,
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Intent confidence grade',
    type: Number,
    required: true,
  })
  confidence: number;
}

export class Intent extends AIIntent {
  @ApiProperty({
    description: 'Intent message',
    type: String,
    required: true,
  })
  message: string;
}

export class CreateIntentRes {
  @ApiProperty({
    description: 'Created intent id',
    type: String,
    required: true,
  })
  id: string;
}
