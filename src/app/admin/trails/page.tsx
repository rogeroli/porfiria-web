import { redirect } from 'next/navigation';

export default function AdminTrailsRedirectPage() {
  redirect('/admin/questionnaires');
}
