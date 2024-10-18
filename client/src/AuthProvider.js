import React, { createContext } from 'react'
import { useProvideAuth } from './useProvidedAuth';

export const authContext = createContext();

export function ProvideAuth({ children }) {

  const auth = useProvideAuth();

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}
