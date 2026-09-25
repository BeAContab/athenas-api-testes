import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ModeProvider } from "@/lib/mode-context";
import { getMode } from "@/lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Athenas Dashboard",
  description: "Painel de gestão sobre a API Athenas Online",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = await getMode();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ModeProvider initialMode={mode}>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
