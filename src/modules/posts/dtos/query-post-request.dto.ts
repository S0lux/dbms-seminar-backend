import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const queryPostRequestSchema = z.object({
  title: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
});

export class QueryPostRequestDto extends createZodDto(queryPostRequestSchema) {}
