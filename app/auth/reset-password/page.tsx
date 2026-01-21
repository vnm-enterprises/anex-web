/**
 * Reset Password page.
 * Combines the image panel and reset password form.
 * Expects `?token=...` in URL query parameters.
 */
import AuthImagePanel from "@/components/auth/AuthImagePanel";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="h-screen w-full overflow-hidden flex bg-background-light dark:bg-background-dark">
      <AuthImagePanel />
      <ResetPasswordForm />
    </main>
  );
}