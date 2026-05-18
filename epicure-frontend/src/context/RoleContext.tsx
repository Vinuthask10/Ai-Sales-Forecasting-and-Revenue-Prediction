"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface RoleContextType {
  role: "manager" | "admin" | null;
  setRole: (role: "manager" | "admin" | null) => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
  registeredManager: any;
  setRegisteredManager: (manager: any) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<"manager" | "admin" | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [registeredManager, setRegisteredManager] = useState<any>(null);

  return (
    <RoleContext.Provider value={{ role, setRole, userName, setUserName, registeredManager, setRegisteredManager }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
