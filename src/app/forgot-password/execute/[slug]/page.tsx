import { ChangePasswordForm } from "./_components/change-password-form";

export default async function ForgotPasswordExecutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <section>
      <ChangePasswordForm token={slug} />
    </section>
  );
}
