import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Message {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Message text',
    type: String,
    required: true,
  })
  message: string;
}

export class Intent {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Intent confidence grade',
    type: Number,
    required: true,
  })
  confidence: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Intent name',
    type: String,
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Intent message',
    type: String,
    required: true,
  })
  message: string;
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

export class CreateIntentRes {
  @ApiProperty({
    description: 'Created intent id',
    type: String,
    required: true,
  })
  id: string;
}

export class DeleteIntentByIdReq {
  @IsMongoId()
  @ApiProperty({
    description: 'Intent id',
    type: String,
    required: true,
  })
  id: string;
}
