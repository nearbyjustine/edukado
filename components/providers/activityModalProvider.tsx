"use client";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

// interface ContextType {
//   value: string | Dispatch<SetStateAction<string>>;
// }

type IsActivityModalOpen = boolean;
type IsActivityModalOpenContext = [IsActivityModalOpen, Dispatch<SetStateAction<IsActivityModalOpen>>];

const Context = createContext<IsActivityModalOpenContext>([false, () => null]);

export function IsActivityModalOpenProvider({ children }: { children: React.ReactNode }) {
  const [IsActivityModalOpen, setIsActivityModalOpen] = useState<IsActivityModalOpen>(false);
  return <Context.Provider value={[IsActivityModalOpen, setIsActivityModalOpen]}>{children}</Context.Provider>;
}

export function useIsActivityModalOpenContext() {
  return useContext(Context);
}
