import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createPostRequestSchema = z.object({
  title: z.string().nonempty(),
  content: z.string().nonempty(),
});

export class CreatePostRequestDto extends createZodDto(
  createPostRequestSchema,
) {}
