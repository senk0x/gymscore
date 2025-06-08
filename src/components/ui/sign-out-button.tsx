"use client";

import { signOut } from '@/lib/auth';

export function SignOutButton() {
  return (
    <button onClick={() => signOut()}>
      Sign out
    </button>
  );
} 