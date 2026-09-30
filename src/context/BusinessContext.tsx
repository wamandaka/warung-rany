"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { BusinessSettings, OpeningHoursData } from "@/types";
import { getBusinessSettings, getOpeningHours } from "@/services/settings";
import { initialSettings, initialOpeningHours } from "@/lib/firebase/mockData";
import { isStoreCurrentlyOpen } from "@/lib/utils";

interface BusinessContextType {
  settings: BusinessSettings;
  openingHours: OpeningHoursData;
  isLoading: boolean;
  storeStatus: { isOpen: boolean; message: string };
  refreshSettings: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [openingHours, setOpeningHours] = useState<OpeningHoursData>(initialOpeningHours);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchConfig = useCallback(async () => {
    try {
      const [s, h] = await Promise.all([getBusinessSettings(), getOpeningHours()]);
      setSettings(s);
      setOpeningHours(h);
    } catch (e) {
      console.warn("Failed to fetch business settings", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();

    const handleSync = () => {
      fetchConfig();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchConfig();
      }
    };

    window.addEventListener("storage_sync", handleSync);
    window.addEventListener("storage", handleSync);
    window.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage_sync", handleSync);
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchConfig]);

  const storeStatus = isStoreCurrentlyOpen(openingHours);

  return (
    <BusinessContext.Provider
      value={{
        settings,
        openingHours,
        isLoading,
        storeStatus,
        refreshSettings: fetchConfig,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
