"use client";

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BotMessageSquare, Menu } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  sidebarContent: ReactNode;
}

export function AppLayout({ children, sidebarContent }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-0">
           <div className="flex items-center gap-2 w-full p-4 border-b">
              <BotMessageSquare className="h-7 w-7 text-primary shrink-0" />
              <h1 className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">
                Momentum AI
              </h1>
           </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          {sidebarContent}
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end">
          <div className="md:hidden"> {/* Mobile Trigger */}
             <SidebarTrigger asChild>
               <Button variant="ghost" size="icon">
                 <Menu className="h-6 w-6" />
                 <span className="sr-only">Toggle Menu</span>
               </Button>
             </SidebarTrigger>
          </div>
          {/* Placeholder for user navigation or other header content on desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* e.g. <UserNav /> */}
          </div>
        </header>
        <main className="flex-1">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
