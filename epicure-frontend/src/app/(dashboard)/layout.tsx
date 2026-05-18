"use client";

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { DateProvider } from "@/context/DateContext";
import { useRole } from "@/context/RoleContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (role === null) {
      router.replace("/login");
      return;
    }

    const isAdminPath = pathname.startsWith("/admin");
    const isSharedPath = pathname === "/data" || pathname === "/about";

    if (role === "admin" && !isAdminPath && !isSharedPath) {
      router.replace("/admin/dashboard");
      return;
    }

    if (role === "manager" && isAdminPath) {
      router.replace("/");
      return;
    }

    setIsAuthorized(true);
  }, [role, pathname, router]);

  if (!isAuthorized) {
    return <div className="flex items-center justify-center h-screen bg-black text-white/50">Loading...</div>;
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DateProvider>
      <AuthGuard>
        <div className="flex h-screen overflow-hidden bg-black text-white selection:bg-indigo-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-10 pointer-events-none" />
          
          <Sidebar />

          <div className="flex-1 flex flex-col h-screen overflow-hidden relative text-white">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-8 relative z-0">
              {children}
            </main>
          </div>
        </div>
      </AuthGuard>
    </DateProvider>
  );
}
