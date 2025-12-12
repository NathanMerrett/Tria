import React from 'react';
import { useLogin } from '@/src/features/authentication/hooks/useLogin';
import { LoginForm } from '@/src/features/authentication/components/LoginForm';
import { AuthLayout } from '@/src/features/authentication/components/AuthLayout';

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSignIn
  } = useLogin();

  return (
    <AuthLayout>
      <LoginForm
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        isLoading={isLoading}
        onSubmit={handleSignIn}
      />
    </AuthLayout>
  );
}