"use client";
import React from "react";
import parse from "html-react-parser";
import Link from "next/link";
import { ArrowDownToLine, Link2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentAnswerActivity } from "@/lib/collection.types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";

const ActivityBox = ({ answer, maxPoints }: { answer: StudentAnswerActivity; maxPoints: number }) => {
  const scoreSchema = z.object({
    points: z.coerce
      .number({ required_error: "Points is required" })
      .min(0, { message: "Points must not be less than 0" })
      .max(maxPoints, { message: `Points must not be greater than ${maxPoints}` }),
  });

  const form = useForm<z.infer<typeof scoreSchema>>({
    resolver: zodResolver(scoreSchema),
  });

  const changeScore = async (values: z.infer<typeof scoreSchema>) => {
    console.log(values);
    // update score of student activity
    const supabase = createClient();
    console.log(await supabase.from("student_answers_activity").update({ points: values.points, isScored: true }).eq("id", answer.id).select().single());
  };

  if (answer.profiles) {
    return (
      <div>
        <div className='relative flex flex-col gap-4 p-4 border rounded-lg select-none cursor-pointer'>
          <div className='absolute -top-3 -right-2 bg-primary p-2 text-primary-foreground rounded-md'>
            {answer.points}/{maxPoints}
          </div>
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
          {(answer.isScored && (
            <Dialog>
              <DialogTrigger className=''>
                <div className='bg-primary p-2 w-56 flex-none text-primary-foreground rounded-md'>Update Score</div>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <form method='post' onSubmit={form.handleSubmit(changeScore)}>
                  <DialogHeader>
                    <DialogTitle>Update Score</DialogTitle>
                    {/* <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription> */}
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='points' className='text-right'>
                        Points
                      </Label>
                      <Input {...form.register("points")} min={0} max={maxPoints} type='number' id='points' defaultValue={answer.points} className='col-span-3' />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>{form.formState.errors.points && <div>form.formState.errors.points.message</div>}</div>
                  </div>
                  <DialogFooter>
                    <Button type='submit'>Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )) || (
            <Dialog>
              <DialogTrigger className=''>
                <div className='bg-primary p-2 w-56 flex-none text-primary-foreground rounded-md'>Score this activity</div>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <form method='post' onSubmit={form.handleSubmit(changeScore)}>
                  <DialogHeader>
                    <DialogTitle>Score this Activity</DialogTitle>
                    {/* <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription> */}
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='points' className='text-right'>
                        Points
                      </Label>
                      <Input {...form.register("points")} min={0} max={maxPoints} type='number' id='points' defaultValue={answer.points} className='col-span-3' />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>{form.formState.errors.points && <div>form.formState.errors.points.message</div>}</div>
                  </div>
                  <DialogFooter>
                    <Button type='submit'>Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    );
  }
};

export default ActivityBox;
