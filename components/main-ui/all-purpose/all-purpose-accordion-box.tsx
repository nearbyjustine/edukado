"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { ClipboardList, Pencil, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const AllPurposeBox = ({ title, id, subjectId, slug }: { title: string; id: number | string; subjectId: string; slug: "activities" | "discussion" | "lesson" | "quiz" }) => {
  return (
    <div className={cn("gap-4 items-center group flex transition-all")}>
      <Link className='flex-1' href={`${process.env.NEXT_PUBLIC_SITE_URL}/teacher/subjects/${subjectId}/${slug}/${id}`}>
        <div className='flex justify-between py-2 pl-6 pr-2 border hover:bg-primary/10 transition-colors rounded-md '>
          <div className='flex gap-4 items-center'>
            <div className='bg-green-500 rounded-3xl h-auto w-auto p-2 text-white'>
              <ClipboardList width={25} height={25} className='' />
            </div>
            <div className='flex flex-col'>
              <p className='font-semibold'>{title}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AllPurposeBox;
