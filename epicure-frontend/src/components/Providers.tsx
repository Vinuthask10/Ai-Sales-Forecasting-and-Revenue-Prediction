"use client";

import { RoleProvider } from "@/context/RoleContext";
import { GlobalFiltersProvider } from "@/context/GlobalFiltersContext";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalFiltersProvider>
      <RoleProvider>{children}</RoleProvider>
    </GlobalFiltersProvider>
  );
}
