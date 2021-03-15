import { ApiProperty } from '@nestjs/swagger';

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
