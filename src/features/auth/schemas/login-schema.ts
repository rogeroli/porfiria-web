import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Informe um email válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
