'use client';

import { AuthForm } from '@/components/auth-form';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <AuthForm isRegister />
      </div>
    </main>
  );
}
