'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/login' })}
      className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-error/10 hover:text-error transition-all text-base-content/60 cursor-pointer"
    >
      <LogOut className="w-5 h-5" />
      <span>Cerrar sesión</span>
    </button>
  );
}
