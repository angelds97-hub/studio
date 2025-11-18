'use client';

import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-178px)] flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </main>
  );
}
