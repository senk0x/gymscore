"use client";
import { AuthProvider } from "@/context/AuthContext";
import React from "react";
 
export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
} 