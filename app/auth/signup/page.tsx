import RegisterImagePanel from "@/components/auth/RegisterImagePanel";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="h-screen w-full overflow-hidden flex bg-background-light dark:bg-background-dark">
      <RegisterImagePanel />
      <RegisterForm />
    </main>
  );
}
