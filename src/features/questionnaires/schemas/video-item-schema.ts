import { z } from 'zod';

export const videoItemSchema = z.object({
  file: z
    .unknown()
    .refine((value) => value instanceof FileList && value.length === 1, 'Selecione um video.')
    .refine(
      (value) =>
        value instanceof FileList &&
        value.length === 1 &&
        (value.item(0)?.type.startsWith('video/') ?? false),
      'O arquivo precisa ser um video.',
    ),
});

export type VideoItemFormData = z.infer<typeof videoItemSchema>;
