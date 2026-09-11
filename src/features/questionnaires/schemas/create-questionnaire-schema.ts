import { z } from 'zod';
import { QuestionnaireContentFormat } from '../types/questionnaire';

export const createQuestionnaireSchema = z
  .object({
    title: z.string().min(3, 'Informe um titulo com pelo menos 3 caracteres.'),
    description: z.string().min(10, 'Informe uma descricao com pelo menos 10 caracteres.'),
    contentFormat: z.enum(QuestionnaireContentFormat),
    contentText: z.string().optional(),
    contentFile: z.unknown().optional(),
  })
  .superRefine((data, context) => {
    if (
      [QuestionnaireContentFormat.Html, QuestionnaireContentFormat.Txt].includes(data.contentFormat) &&
      (!data.contentText || data.contentText.trim().length === 0)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Informe o conteudo do questionario.',
        path: ['contentText'],
      });
    }

    const fileList = data.contentFile as { length?: number; item?: (index: number) => File | null } | undefined;

    if ([QuestionnaireContentFormat.Video, QuestionnaireContentFormat.Pdf].includes(data.contentFormat) && fileList?.length) {
      const selectedFile = fileList.item?.(0);
      const isInvalidVideo =
        data.contentFormat === QuestionnaireContentFormat.Video && !selectedFile?.type.startsWith('video/');
      const isInvalidPdf =
        data.contentFormat === QuestionnaireContentFormat.Pdf && selectedFile?.type !== 'application/pdf';

      if (isInvalidVideo || isInvalidPdf) {
        context.addIssue({
          code: 'custom',
          message: 'Envie um arquivo compativel com o formato selecionado.',
          path: ['contentFile'],
        });
      }
    }
  });

export type CreateQuestionnaireFormData = z.infer<typeof createQuestionnaireSchema>;
