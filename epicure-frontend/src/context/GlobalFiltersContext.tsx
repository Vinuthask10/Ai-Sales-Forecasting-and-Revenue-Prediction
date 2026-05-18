"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalFiltersContextType {
  branch: string;
  setBranch: (branch: string) => void;
  orderType: string;
  setOrderType: (orderType: string) => void;
  weather: string;
  setWeather: (weather: string) => void;
  festivalMode: boolean;
  setFestivalMode: (mode: boolean) => void;
}

const GlobalFiltersContext = createContext<GlobalFiltersContextType | undefined>(undefined);

export const GlobalFiltersProvider = ({ children }: { children: ReactNode }) => {
  const [branch, setBranch] = useState("All Branches");
  const [orderType, setOrderType] = useState("All");
  const [weather, setWeather] = useState("Sunny");
  const [festivalMode, setFestivalMode] = useState(false);

  return (
    <GlobalFiltersContext.Provider value={{
      branch, setBranch,
      orderType, setOrderType,
      weather, setWeather,
      festivalMode, setFestivalMode
    }}>
      {children}
    </GlobalFiltersContext.Provider>
  );
};

export const useGlobalFilters = () => {
  const context = useContext(GlobalFiltersContext);
  if (context === undefined) {
    throw new Error("useGlobalFilters must be used within a GlobalFiltersProvider");
  }
  return context;
};
