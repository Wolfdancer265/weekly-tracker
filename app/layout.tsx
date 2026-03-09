import type { Metadata } from "next";
import "@/app/globals.css";
import { AppNav } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Weekly Strategic Companion",
  description: "Calm weekly tracker for Inner Wolves, Sapphire Dragon, and Physical Vitality."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <AppNav />
          {children}
        </main>
      </body>
    </html>
  );
}
