import React from 'react';
import { useForgotPassword } from '@/src/features/authentication/hooks/useForgotPassword';
import { ForgotPasswordForm } from '@/src/features/authentication/components/ForgotPasswordForm';
import { AuthLayout } from '@/src/features/authentication/components/AuthLayout';

export default function ForgotPasswordScreen() {
    const { email, setEmail, isLoading, handleReset } = useForgotPassword();

    return (
        <AuthLayout>
            <ForgotPasswordForm
                email={email}
                onEmailChange={setEmail}
                isLoading={isLoading}
                onSubmit={handleReset}
            />
        </AuthLayout>
    );
}