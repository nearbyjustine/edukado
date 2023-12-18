"use client";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

// interface ContextType {
//   value: string | Dispatch<SetStateAction<string>>;
// }

type collapse = boolean;
type collapseContext = [collapse, Dispatch<SetStateAction<collapse>>];

const Context = createContext<collapseContext>([false, () => null]);

export function CollapseProvider({ children }: { children: React.ReactNode }) {
  const [collapse, setCollapse] = useState<collapse>(false);
  return <Context.Provider value={[collapse, setCollapse]}>{children}</Context.Provider>;
}

export function useCollapseContext() {
  return useContext(Context);
}
