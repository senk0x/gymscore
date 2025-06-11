import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Gymscore - Track & Share Your Fitness Progress",
  description: "Calculate your Gymscore from strength, physique, and training frequency. Track fitness progress, see your ranking, and share your score with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="antialiased">
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
