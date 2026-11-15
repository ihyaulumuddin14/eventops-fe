import { RegisterForm } from "@/features/auth/components/RegisterForm";
import AuthContainer from "@/features/auth/containers/AuthContainer";
import { AuthLayout } from "@/shared/layout/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthContainer>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </AuthContainer>
  );
}
