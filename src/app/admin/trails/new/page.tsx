import { redirect } from 'next/navigation';

export default function NewTrailRedirectPage() {
  redirect('/admin/questionnaires/new');
}
