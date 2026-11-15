import { LoginForm } from "@/features/auth/components/LoginForm";
import AuthContainer from "@/features/auth/containers/AuthContainer";
import { AuthLayout } from "@/shared/layout/AuthLayout";

export default function LoginPage() {
  return (
    <AuthContainer>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </AuthContainer>
  );
}
