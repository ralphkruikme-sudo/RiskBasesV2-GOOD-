/* Onboarding has its own fullscreen UI — suppress the app chrome */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
