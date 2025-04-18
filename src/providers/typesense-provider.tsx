'use client'
import React, { useEffect } from "react";

export const TypesenseProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    fetch("/api/sync-typesense")
      .then((res) => res.json())
      .then((res) => console.log("Synced to Typesense:", res));
  }, []);

  return <>{children}</>;
};
