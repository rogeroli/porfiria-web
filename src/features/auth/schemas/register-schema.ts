import { z } from 'zod';

const passwordPolicyMessage =
  'A senha deve ter mais de 8 caracteres, incluindo letra maiúscula, letra minúscula, número e caractere especial.';

const passwordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Informe seu nome completo.'),
    profileId: z.uuid('Selecione um perfil válido.'),
    email: z.email('Informe um email válido.'),
    password: z.string().regex(passwordPolicyRegex, passwordPolicyMessage),
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'A confirmação de senha não confere.',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
