import type { Metadata } from "next";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SABOROU - 先延ばしを楽しもう",
  description:
    "先延ばし行動を肯定・ゲーミフィケーション化し、自己取扱説明書データを蓄積するサービス",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <TRPCReactProvider>
          <AuthProvider>{children}</AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
