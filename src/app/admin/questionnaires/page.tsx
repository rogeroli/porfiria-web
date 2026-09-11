import { Suspense } from 'react';
import { AdminQuestionnairesManager } from '@/features/questionnaires/components/admin-questionnaires-manager';

export default function AdminQuestionnairesPage() {
  return (
    <Suspense>
      <AdminQuestionnairesManager />
    </Suspense>
  );
}
