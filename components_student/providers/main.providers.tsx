"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { CollapseProvider } from "./collapseProvider";
import { AuthProvider } from "./auth.providers";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='light'>
      <AuthProvider>
        <CollapseProvider>{children}</CollapseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Providers;
