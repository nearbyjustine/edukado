"use client";

import React from "react";
import { Icons } from "../ui/icons";
import Link from "next/link";
import SidebarItem from "./sidebar-items";
import { BookOpen, Calendar, Folder, LayoutDashboard, LineChart, Menu, Settings } from "lucide-react";
import { useCollapseContext } from "../providers/collapseProvider";

const Sidebar = () => {
  const [collapse, setCollapse] = useCollapseContext();

  return (
    <div
      className={`fixed max-h-screen h-screen left-0 top-0 w-[57px] ${
        collapse ? "lg:w-[57px] lg:px-0" : "lg:w-[16rem] lg:px-8"
      } justify-start border-r dark:border-gray-500 flex flex-col gap-3 transition-all pt-16 `}
    >
      <Menu className='absolute right-3 top-3 hover:cursor-pointer hidden lg:inline text-primary' size={30} onClick={() => setCollapse(!collapse)} />

      <Link href='/teacher' className={`hidden ${collapse ? "lg:hidden" : "lg:block"}  mb-5`}>
        <Icons.edukado className='fill-green-600' />
      </Link>
      <SidebarItem href='/teacher' text='Dashboard' Icon={LayoutDashboard} />
      <SidebarItem href='/teacher/subjects' text='Classrooms' Icon={BookOpen} />
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
