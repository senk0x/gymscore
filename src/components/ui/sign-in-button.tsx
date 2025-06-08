"use client";

import { signInWithGoogle } from '@/lib/auth';

interface SignInButtonProps {
  onClick?: () => void;
}

export function SignInButton({ onClick }: SignInButtonProps) {
  return (
    <button
      onClick={() => {
        if (onClick) onClick();
        signInWithGoogle();
      }}
      aria-label="Sign in with Google"
      className="w-full flex items-center justify-center gap-2 bg-white text-[#222] font-medium text-[13px] py-2 rounded-[16px] shadow hover:bg-[#f5f5f5] transition-colors border border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
      style={{ minHeight: 40 }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_993_771)">
            <path d="M19.8052 10.2309C19.8052 9.55082 19.7491 8.86727 19.629 8.19824H10.2V12.0491H15.6261C15.393 13.2941 14.6525 14.3827 13.6019 15.0764V17.3141H16.6832C18.4292 15.7227 19.8052 13.2727 19.8052 10.2309Z" fill="#4285F4"/>
            <path d="M10.2 20C12.7009 20 14.7891 19.1764 16.6832 17.3141L13.6019 15.0764C12.5409 15.7964 11.2427 16.2155 10.2 16.2155C7.78545 16.2155 5.73545 14.5091 4.96545 12.2946H1.7832V14.6001C3.68909 17.9782 6.78909 20 10.2 20Z" fill="#34A853"/>
            <path d="M4.96545 12.2946C4.76545 11.7746 4.65454 11.2164 4.65454 10.6364C4.65454 10.0564 4.76545 9.49819 4.96545 8.97819V6.67273H1.7832C1.14318 7.93636 0.800903 9.25455 0.800903 10.6364C0.800903 12.0182 1.14318 13.3364 1.7832 14.6001L4.96545 12.2946Z" fill="#FBBC05"/>
            <path d="M10.2 5.05636C11.3573 5.05636 12.3982 5.45455 13.2173 6.23637L16.7427 2.70909C14.7891 0.936364 12.7009 0 10.2 0C6.78909 0 3.68909 2.02182 1.7832 5.39999L4.96545 7.70545C5.73545 5.49091 7.78545 5.05636 10.2 5.05636Z" fill="#EA4335"/>
          </g>
          <defs>
            <clipPath id="clip0_993_771">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </span>
      <span>Sign in with Google</span>
    </button>
  );
} 