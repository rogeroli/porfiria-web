import { AdminQuestionnaireEditor } from '@/features/questionnaires/components/admin-questionnaire-editor';

export default async function EditQuestionnairePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AdminQuestionnaireEditor questionnaireId={id} />;
}
