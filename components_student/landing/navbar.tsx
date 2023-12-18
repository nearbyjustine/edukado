"use client";

import React, { useState } from "react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  return (
    <>
      <div className='hidden sm:flex  justify-between px-4 py-2 bg-primary w-screen '>
        <div className='flex'>
          <Icons.edukado className='sm:w-16 md:w-32 fill-primary-foreground' />
        </div>
        <div className='flex text-primary-foreground '>
          <Button variant='nav' asChild className='text-sm sm:text-lg font-semibold'>
            <Link href={""}>Home</Link>
          </Button>
          <Button variant='nav' asChild className='text-sm sm:text-lg font-semibold'>
            <Link href={""}>About</Link>
          </Button>
          <Button variant='nav' asChild className='text-sm sm:text-lg font-semibold'>
            <Link href={""}>Contact</Link>
          </Button>
        </div>
        <div className='flex gap-1'>
          {/* placeholder for buttons */}
          <Button asChild variant='nav' className='text-primary-foreground'>
            <Link href='/teacher-login'>Sign in as Teacher</Link>
          </Button>
          <Button variant='nav_alt'>
            <Link href='/student-login'>Sign in as Student</Link>
          </Button>
        </div>
      </div>
      <div className='absolute top-1 right-1 sm:hidden px-4 py-2'>
        <Button onClick={() => setIsNavOpen((prev) => !prev)} variant='default' className='rounded-full w-14 h-14'>
          <Menu className='text-primary-foreground' width={20} height={20} />
        </Button>
      </div>
      <div className={cn("w-screen h-screen bg-primary", isNavOpen ? "block" : "hidden")}>
        {/* TODO: make navbar responsive for small devices */}
        <div>Hello</div>
      </div>
    </>
  );
};

export default Navbar;
