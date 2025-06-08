import { CircleUserRound } from "lucide-react";
import React from "react";

interface ProfileIconProps {
  onClick?: () => void;
  initial?: string;
  disabled?: boolean;
}

export function ProfileIcon({ onClick, initial, disabled }: ProfileIconProps) {
  if (disabled) {
    return (
      <div
        className="w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-sm bg-[#27272A] border-[#3D3D40] text-lg font-bold text-white select-none profile-icon"
        style={{ pointerEvents: "none" }}
      >
        {initial ? initial.toUpperCase() : <CircleUserRound color="#fff" size={28} strokeWidth={2} />}
      </div>
    );
  }
  return (
    <button
      className="w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:scale-105 hover:brightness-110 bg-[#27272A] border-[#3D3D40] profile-icon"
      aria-label="User profile"
      onClick={onClick}
      type="button"
    >
      {initial ? initial.toUpperCase() : <CircleUserRound color="#fff" size={28} strokeWidth={2} />}
    </button>
  );
} 