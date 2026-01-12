
import AuthImagePanel from "@/components/auth/AuthImagePanel";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {


  return (
    <main className="h-screen w-full overflow-hidden flex bg-background-light dark:bg-background-dark">
      <AuthImagePanel />
      <LoginForm />
    </main>
  );
}
