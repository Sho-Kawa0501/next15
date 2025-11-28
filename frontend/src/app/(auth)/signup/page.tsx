import { AuthForm } from "@/components/auth/auth-form";
import { signup } from "../login/actions";

interface SignupPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const sp = (await searchParams) ?? {};
  const error = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <AuthForm
      title="新規登録"
      mode="signup"
      action={signup}
      error={error}
    />
  );
}