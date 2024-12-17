import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren, ReactNode } from "react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: "app template",
  description: "😸",
};

export const viewport: Viewport = {
  // for mobile
  maximumScale: 1,
};

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
  return (
    <html lang="en">
      <body
        className={[
          inter.className,
          // for dialog
          "has-[dialog[open]]:overflow-hidden",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
