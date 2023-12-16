"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {theme == "dark" ? <Sun className='hover:cursor-pointer' size={25} onClick={() => setTheme("light")} /> : <Moon className='hover:cursor-pointer' size={25} onClick={() => setTheme("dark")} />}
    </div>
  );
};

export default ThemeSwitch;
