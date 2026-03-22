'use client';

import { useAuth } from '@clerk/nextjs';
import { SignInButton, UserButton } from '@clerk/nextjs';

export function AuthHeader() {
  const { isSignedIn } = useAuth();

  return (
    <div className="absolute top-5 right-7 z-50">
      {isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9 border-2 border-cyan-400/60"
            }
          }}
        />
      ) : (
        <SignInButton mode="modal">
          <button className="px-5 py-2 rounded-xl pitch-gradient text-white font-bold text-sm shadow-md shadow-cyan-200 hover:opacity-90 transition-all">
            Entrar
          </button>
        </SignInButton>
      )}
    </div>
  );
}
