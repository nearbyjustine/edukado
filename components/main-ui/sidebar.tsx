"use client";

import React from "react";
import { Icons } from "../ui/icons";
import Link from "next/link";
import SidebarItem from "./sidebar-items";
import { Calendar, Folder, LayoutDashboard, LineChart, Menu, Settings } from "lucide-react";
import { useCollapseContext } from "../providers/collapseProvider";

const Sidebar = () => {
  const [collapse, setCollapse] = useCollapseContext();

  return (
    <div
      className={`sticky w-[57px] ${
        collapse ? "lg:w-[57px] lg:px-0" : "lg:w-[16rem] lg:px-8"
      } justify-start border-r dark:border-gray-500 h-screen flex flex-col left-0 top-0 gap-3 transition-all pt-16 `}
    >
      <Menu className='absolute right-3 top-3 hover:cursor-pointer hidden lg:inline text-green-900' size={30} onClick={() => setCollapse(!collapse)} />

      <Link href='/teacher' className={`hidden ${collapse ? "lg:hidden" : "lg:block"}  mb-5`}>
        <Icons.edukado className='fill-green-600' />
      </Link>
      <SidebarItem href='/teacher' text='Dashboard' Icon={LayoutDashboard} />
      <SidebarItem href='/teacher/subjects' text='Subjects' Icon={Folder} />
      {/* <SidebarItem href='/teacher/exams' text='Examinations' Icon={'pen-tool}' />
      <SidebarItem href='/teacher/lessons' text='Lessons' Icon={'sticky-note}' />
      <SidebarItem href='/teacher/activities' text='Activities' Icon={'clipboard'} /> */}
      <SidebarItem href='/teacher/calendar' text='Calendar' Icon={Calendar} />
      <SidebarItem href='/teacher/reports' text='Reports' Icon={LineChart} />
      <SidebarItem href='/teacher/settings' text='Settings' Icon={Settings} />
    </div>
  );
};

export default Sidebar;
