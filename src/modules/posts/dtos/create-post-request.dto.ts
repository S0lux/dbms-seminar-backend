import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createPostRequestSchema = z.object({
  title: z.string().min(8, 'Title must be at least 8 characters long'),
  content: z.string().nonempty(),
});

export class CreatePostRequestDto extends createZodDto(
  createPostRequestSchema,
) {}
