import { redirect } from 'next/navigation';

export default async function EditTrailRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  redirect(`/admin/questionnaires/${id}`);
}
