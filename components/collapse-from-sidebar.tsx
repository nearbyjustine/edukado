"use client";

import { ReactNode } from "react";
import { useCollapseContext } from "./providers/collapseProvider";

const CollapseSideBar = ({ children }: { children: ReactNode }) => {
  const [collapse, setCollapse] = useCollapseContext();

  return (
    <div
      className={`absolute max-h-screen top-0 left-[57px] w-[calc(100vw-57px)] lg:w-[calc(100vw-16rem)] ${
        collapse ? "lg:left-[57px] w-[calc(100vw-57px)] lg:w-[calc(100vw-57px)]" : "lg:left-[16rem] w-[calc(100vw-16rem)]"
      } flex -z-0 px-4 py-4 transition-all`}
    >
      {children}
    </div>
  );
};

export default CollapseSideBar;
