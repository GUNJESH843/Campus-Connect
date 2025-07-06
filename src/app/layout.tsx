import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'CampusConnect',
  description: 'Your AI-powered campus assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
