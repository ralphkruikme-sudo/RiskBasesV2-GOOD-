import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SetupRootPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/app/projects/${id}/setup/manual/step-1`);
}
