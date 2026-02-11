/**
 * Forgot Password page.
 * Combines the image panel and forgot password form.
 */
import AuthImagePanel from "@/components/auth/AuthImagePanel";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="h-screen w-full overflow-hidden flex bg-background-light dark:bg-background-dark">
      <AuthImagePanel />
      <ForgotPasswordForm />
    </main>
  );
}