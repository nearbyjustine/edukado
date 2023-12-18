"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useIsActivityModalOpenContext } from "../providers/activityModalProvider";

const CreateActivityButton = () => {
  const [isModalOpen, setIsModalOpen] = useIsActivityModalOpenContext();

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
          <DropdownMenuItem onClick={() => setIsModalOpen((prev) => !prev)} className='w-40 cursor-pointer'>
            Activity
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CreateActivityButton;
