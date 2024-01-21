"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleWidthResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleWidthResize);
    return () => {
      window.removeEventListener("resize", handleWidthResize);
    };
  }, [window.innerWidth]);

  return (
    <>
      <div className='hidden sm:flex justify-between px-4 py-2 bg-primary w-screen '>
        <div className='flex'>
          <Icons.edukado className='sm:w-16 md:w-32 fill-primary-foreground' />
        </div>
        <div className='flex text-primary-foreground '>
          <Button variant='nav' asChild className='text-sm sm:text-lg font-semibold'>
            <Link href='/'>Home</Link>
          </Button>
          <Button variant='nav' asChild className='text-sm sm:text-lg font-semibold'>
            <Link href='#'>About</Link>
          </Button>
          <Button variant='nav' asChild className='text-sm sm:text-lg font-semibold'>
            <Link href='#'>Contact</Link>
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
      {windowWidth < 640 && !isNavOpen && (
        <div className='absolute flex justify-between w-screen sm:hidden p-4 items-center'>
          <div className='w-32'>
            <Icons.edukado className='fill-primary' />
          </div>
          <Button onClick={() => setIsNavOpen((prev) => !prev)} variant='default' className='rounded-full w-14 h-14 z-20'>
            <Menu className={cn(isNavOpen ? "text-primary" : "text-primary-foreground")} width={20} height={20} />
          </Button>
        </div>
      )}
      {windowWidth < 640 && isNavOpen && (
        <div className={cn("relative w-screen h-screen bg-primary p-4 z-10 flex flex-col")}>
          <div>
            <div className='w-32'>
              <Icons.edukado className='fill-primary-foreground' />
            </div>
            <Button
              onClick={() => setIsNavOpen((prev) => !prev)}
              variant='default'
              className={cn(
                "rounded-full w-14 h-14 z-20 absolute top-4 right-4",
                isNavOpen ? "bg-primary-foreground hover:outline-primary-foreground hover:outline transition-all text-primary hover:text-primary-foreground" : "bg-primary"
              )}
            >
              <Menu width={20} height={20} />
            </Button>
          </div>
          <div className='flex flex-col justify-center items-center h-full gap-4'>
            <Button className='text-xl'>
              <Link href='/'>Home</Link>
            </Button>
            <Button className='text-xl'>
              <Link href='#'>About</Link>
            </Button>
            <Button className='text-xl'>
              <Link href='#'>Contact</Link>
            </Button>
            <Button className='text-xl'>
              <Link href='/teacher-login'>Sign in as Teacher</Link>
            </Button>
            <Button className='text-xl'>
              <Link href='/student-login'>Sign in as Student</Link>
            </Button>
          </div>
          {/* TODO: make navbar responsive for small devices */}
        </div>
      )}
    </>
  );
};

export default Navbar;
