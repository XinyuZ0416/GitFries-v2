'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// navbar context
interface NavbarContextProps {
  height: number | null,
  navbarRef: React.RefObject<HTMLElement | null>;
}

const NavbarContext = createContext<NavbarContextProps | null>(null);

export const NavbarProvider = ({children}:{children: React.ReactNode}) => {
  const navbarRef = useRef<HTMLElement>(null);
  const [ height, setHeight ] = useState<number | null>(null);

  useEffect(() => {
    if (navbarRef.current) {
      setHeight(navbarRef.current.offsetHeight);

      // Handle resize if needed
      const observer = new ResizeObserver(() => {
        setHeight(navbarRef.current?.offsetHeight ?? null);
      });
      observer.observe(navbarRef.current);

      return () => observer.disconnect();
    }
  }, []);

  return(
    <NavbarContext.Provider value={{ height, navbarRef }}>
      {children}
    </NavbarContext.Provider>
  );
}

export const useNavbarProvider = () => {
  const context = useContext(NavbarContext);
  if(!context) {
    throw new Error('useNavbar must be used within an NavbarProvider');
  }
  return context;
}
