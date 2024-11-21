import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren, ReactNode } from "react";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import "./globals.css";
import { AppSidebar } from "@/app/_components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/_components/ui/breadcrumb";
import { Separator } from "@/app/_components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/_components/ui/sidebar";

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

type Props = PropsWithChildren<{
  dialog: ReactNode;
}>;

export default async function Layout({ dialog, children }: Props) {
  return (
    <html lang="en">
      <body
        className={[
          inter.className,
          // for dialog
          "has-[dialog[open]]:overflow-hidden",
        ].join(" ")}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="p-4 pt-0">
              <Header />
              <main className="py-4 px-8 flex-1 overflow-y-auto">
                {children}
              </main>
              <Footer />
            </div>
          </SidebarInset>
        </SidebarProvider>

        {dialog}
      </body>
    </html>
  );
}
