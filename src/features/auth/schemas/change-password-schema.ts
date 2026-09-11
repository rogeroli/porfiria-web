import { z } from 'zod';

const passwordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/;
const passwordPolicyMessage =
  'A senha deve ter mais de 8 caracteres, incluindo maiuscula, minuscula, numero e caractere especial.';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe a senha atual ou temporaria.'),
    newPassword: z.string().regex(passwordPolicyRegex, passwordPolicyMessage),
    confirmPassword: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'A confirmacao de senha nao confere.',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
