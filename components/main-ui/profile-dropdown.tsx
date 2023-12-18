"use client";

import { ArrowUp, Bell, Menu } from "lucide-react";
import React, { useEffect, useRef, useState, useTransition } from "react";
import Owen from "@/app/owen.jpg";
import Image from "next/image";
import ThemeSwitch from "./theme-switcher-button";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { fetchUserDetails } from "@/actions/fetch-user-details";
import { User } from "@/lib/collection.types";
import capitalizeFirstLetter from "@/utils/capitalize";
import { logOut } from "@/actions/logout";
import Link from "next/link";
import LogoutButton from "../buttons/logout-button";

interface UserWithRole extends User {
  role: string;
}

const ProfileBar = ({ firstName, lastName, role, avatarUrl }: { firstName: string; lastName: string; role: string; avatarUrl: string }) => {
  const [isDropDownActive, setIsDropDownActive] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserWithRole>();
  const [loading, startTransition] = useTransition();

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserOnLoad = async () => {
      const { user, error, role } = await fetchUserDetails();
      if (!error && user) {
        setUserDetails({ ...user, role });
        return;
      }
      return console.error(error);
    };

    fetchUserOnLoad();

    const dropDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropDownActive(false);
      }
    };
    document.addEventListener("mousedown", dropDown);

    // return document.removeEventListener("mousedown", dropDown);
  }, []);

  return (
    <div className='absolute z-10 top-0 right-0 px-2 py-2'>
      <div className='flex flex-1 justify-end gap-1 md:gap-5 items-center'>
        <div className='relative'>
          <Bell className='hover:cursor-pointer' size={25} />
          <span className='absolute bg-red-500 w-3 right-0 top-0 h-3 rounded-full'></span>
        </div>
        <ThemeSwitch />
        <div className='flex items-center'>
          <div ref={dropdownRef} className='relative flex gap-2 items-center'>
            <div
              onClick={() => setIsDropDownActive(!isDropDownActive)}
              className={`flex items-center p-2 gap-4 rounded-full cursor-pointer ${
                isDropDownActive ? "bg-green-300 dark:bg-green-700" : ""
              } hover:bg-green-300  dark:hover:bg-green-700 transition-all`}
            >
              <Image className='rounded-full w-10 h-10' width={35} height={35} src={avatarUrl ? avatarUrl : Owen} alt='profile image' />
              <p className='text-xl font-bold select-none hidden lg:inline'>{userDetails ? `${userDetails.first_name} ${userDetails.last_name}` : `${firstName} ${lastName}`}</p>
              <ArrowUp className={`${isDropDownActive ? "rotate-180" : "rotate-0"} transition-transform hidden lg:inline`} size={25} />
            </div>
            <div
              className={`absolute top-16 right-1 bg-white text-black outline outline-1 outline-green-600 p-2 w-52 rounded flex flex-col ${
                isDropDownActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              } transition-all`}
            >
              <ul className=''>
                <li className='border-b border-grey-400 flex flex-col items-center cursor-pointe select-none px-2 py-2 rounded transition-all'>
                  <span className='font-semibold text-lg'>{userDetails ? `${userDetails.first_name} ${userDetails.last_name}` : `${firstName} ${lastName}`}</span>
                  <span>{userDetails ? capitalizeFirstLetter(userDetails.role) : role}</span>
                </li>
                <li>
                  <LogoutButton className='cursor-pointer hover:bg-green-400 px-2 py-2 rounded transition-all w-full' />
                </li>
                <Link href='/teacher/settings'>
                  <button className='cursor-pointer hover:bg-green-400 px-2 py-2 rounded transition-all w-full'>Settings</button>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBar;
