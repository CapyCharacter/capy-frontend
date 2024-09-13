'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

const MobileContext = createContext<boolean>(true);

export const useMobileContext = () => useContext(MobileContext);

interface MobileDetectionProviderProps {
  children: ReactNode;
}

export const MobileDetectionProvider: React.FC<MobileDetectionProviderProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(true);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    setIsPending(false);
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <MobileContext.Provider value={isMobile}>
      {isPending ? null : children}
    </MobileContext.Provider>
  );
};
