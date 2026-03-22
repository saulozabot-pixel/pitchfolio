'use client';

import { useAuth } from '@clerk/nextjs';
import { SignInButton, UserButton } from '@clerk/nextjs';

export function AuthHeader() {
  const { isSignedIn } = useAuth();

  return (
    <div className="absolute top-6 right-8 z-50">
      {isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10 border-2 border-purple-500/50"
            }
          }}
        />
      ) : (
        <SignInButton mode="modal">
          <button className="px-6 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors">
            Elite Sign In
          </button>
        </SignInButton>
      )}
    </div>
  );
}
