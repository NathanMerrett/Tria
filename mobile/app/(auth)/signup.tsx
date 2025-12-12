import React from 'react';
import { useSignUp } from '@/src/features/authentication/hooks/useSignUp';
import { SignUpForm } from '@/src/features/authentication/components/SignUpForm';
import { AuthLayout } from '@/src/features/authentication/components/AuthLayout';

export default function SignUpScreen() {
  const {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isLoading,
    handleSignUp
  } = useSignUp();

  return (
    <AuthLayout>
      <SignUpForm
        username={username}
        onUsernameChange={setUsername}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        isLoading={isLoading}
        onSubmit={handleSignUp}
      />
    </AuthLayout>
  );
}