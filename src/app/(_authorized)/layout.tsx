import type { PropsWithChildren, ReactNode } from "react";
import "../globals.css";
import { options } from "@/app/_clients/nextAuth";
import { Footer } from "@/app/_components/Footer";
import { Header } from "@/app/_components/Header";
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
import { getServerSession } from "next-auth";

type Props = PropsWithChildren<{
  dialog: ReactNode;
}>;

export default async function Layout({ dialog, children }: Props) {
  const user = await getServerSession(options);

  return (
    <>
      <SidebarProvider>
        <AppSidebar user={user?.user} />
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
            <main className="py-4 px-8 flex-1 overflow-y-auto">{children}</main>
            <Footer />
          </div>
        </SidebarInset>
      </SidebarProvider>
      {dialog}
    </>
  );
}
