"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useAuth } from '@/context/AuthContext';

function Component() {
  const { user } = useAuth();
  const id = useId();
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate the share link for the current user
  const shareLink = user ? `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${user.id}` : '';

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full bg-[#27272A] border border-[#27272A] shadow-sm hover:bg-[#232326] px-8 py-2 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:scale-105">
            <span className="text-[13px] poppins-medium text-[#67676A]">🔗 Share</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-[#232326] border-[#27272A] text-white shadow-lg rounded-2xl p-4 animate-fade-in animate-scale-in origin-top transition-all duration-300">
          <div className="flex flex-col gap-3 text-center">
            <div className="text-sm font-medium text-[#A0A0A0]">Share code</div>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  ref={inputRef}
                  id={id}
                  className="pe-9 bg-[#232326] border-[#27272A] text-[#A0A0A0] placeholder:text-[#67676A] rounded-xl"
                  type="text"
                  value={shareLink}
                  aria-label="Share link"
                  readOnly
                />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopy}
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-[#A0A0A0] outline-offset-2 transition-colors hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#27272A] disabled:pointer-events-none disabled:cursor-not-allowed"
                        aria-label={copied ? "Copied" : "Copy to clipboard"}
                        disabled={copied}
                      >
                        <div
                          className={cn(
                            "transition-all",
                            copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                          )}
                        >
                          <Check
                            className="stroke-emerald-500"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className={cn(
                            "absolute transition-all",
                            copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                          )}
                        >
                          <Copy size={16} strokeWidth={2} aria-hidden="true" />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs bg-[#232326] border-[#27272A] text-[#A0A0A0]">Copy to clipboard</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { Component }; 