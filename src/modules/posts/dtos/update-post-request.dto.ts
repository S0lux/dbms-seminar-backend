import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updatePostRequestSchema = z.object({
  content: z.string().nonempty(),
});

export class UpdatePostRequestDto extends createZodDto(
  updatePostRequestSchema,
) {}
