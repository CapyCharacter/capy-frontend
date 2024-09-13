"use client";

import React, { createContext, useContext, useState } from 'react';

interface GlobalContextType {
  justLoggedIn: boolean;
  justLoggedOut: boolean;
  setJustLoggedIn: (value: boolean) => void;
  setJustLoggedOut: (value: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  }
  return context;
};

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  const value = {
    justLoggedIn,
    justLoggedOut,
    setJustLoggedIn,
    setJustLoggedOut,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};
