import { z } from 'zod';
import { VoteType } from '../../votes/entities/vote.entity';
import { createZodDto } from 'nestjs-zod';

export const votePostRequestSchema = z.object({
  type: z.nativeEnum(VoteType),
});

export class VotePostRequestDto extends createZodDto(votePostRequestSchema) {}
