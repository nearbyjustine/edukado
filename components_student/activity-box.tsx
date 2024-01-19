import React from "react";
import parse from "html-react-parser";
import Link from "next/link";
import { ArrowDownToLine, Link2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentAnswerActivity } from "@/lib/collection.types";

const ActivityBox = ({ answer }: { answer: any }) => {
  if (answer.profiles) {
    return (
      <div>
        <div className='flex flex-col gap-4 p-4 border rounded-lg select-none cursor-pointer'>
          <h1 className='text-2xl underline font-bold'>{`${answer.profiles.first_name} ${answer.profiles.last_name}'s Answer`}</h1>
          <div>{parse(answer.content)}</div>
          <div>
            {answer.file_url && (
              <Link className='text-blue-400 hover:underline flex gap-2 items-center' href={answer.file_url}>
                <ArrowDownToLine width={20} height={20} />
                {`File that ${answer.profiles.first_name} sent`}
              </Link>
            )}
          </div>
          <div>
            {answer.link_url && (
              <Link className='text-blue-400 hover:underline flex gap-2 items-center' href={answer.link_url}>
                <Link2 width={20} height={20} />
                {`Link that ${answer.profiles.first_name} sent`}
              </Link>
            )}
          </div>
          <Dialog>
            <DialogTrigger className=''>
              <div className='bg-primary p-2 w-32 flex-none text-primary-foreground rounded-md'>Score this activity</div>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Name
                  </Label>
                  <Input id='name' defaultValue='Pedro Duarte' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    Username
                  </Label>
                  <Input id='username' defaultValue='@peduarte' className='col-span-3' />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }
};

export default ActivityBox;
