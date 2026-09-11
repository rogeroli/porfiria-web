import { z } from 'zod';

export const quizItemSchema = z
  .object({
    question: z.string().min(5, 'Informe uma pergunta com pelo menos 5 caracteres.'),
    option1: z.string().min(1, 'Informe a alternativa 1.'),
    option2: z.string().min(1, 'Informe a alternativa 2.'),
    option3: z.string().optional(),
    option4: z.string().optional(),
    correctOptions: z.array(z.string()).min(1, 'Selecione ao menos uma resposta correta.'),
  })
  .refine((data) => data.correctOptions.every((option) => Boolean(data[option as keyof typeof data])), {
    message: 'A resposta correta precisa ter texto preenchido.',
    path: ['correctOptions'],
  });

export type QuizItemFormData = z.infer<typeof quizItemSchema>;
