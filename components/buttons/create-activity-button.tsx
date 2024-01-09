"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useIsActivityModalOpenContext } from "../providers/activityModalProvider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ActivityModal from "../providers/modal/activity-modal";
import Link from "next/link";
import { usePathname } from "next/navigation";
const CreateActivityButton = ({ subjectId }: { subjectId: string }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className='hover:bg-primary/80 hover:scale-[1.1] transition-transform'>
            <PlusCircle className='text-white' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='select-none'>Assessment Types</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`${usePathname()}/activities`}>
            <DropdownMenuItem className='cursor-pointer'>Activity</DropdownMenuItem>
          </Link>
          <Link href={`${usePathname()}/quiz`}>
            <DropdownMenuItem className='cursor-pointer'>Quiz</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CreateActivityButton;
