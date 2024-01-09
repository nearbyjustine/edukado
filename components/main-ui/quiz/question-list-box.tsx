import { QuestionType } from "@/components/forms/quiz-edit-form";
import React, { useState } from "react";
import Link from "next/link";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const QuestionListBox = ({ question, index, path }: { question: QuestionType; index: number; path: string }) => {
  const [hidden, setHidden] = useState(false);

  const handleDeleteQuestion = async () => {
    setHidden(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("questions").delete().eq("id", question.id);

    console.log(data, error);
  };
  return (
    <div className={cn("px-2 py-4 h-fit justify-between border-primary/50 border-2 rounded-md text-foreground transition-colors group", hidden ? "hidden" : "flex")}>
      <div className='select-none'>
        <span className='font-semibold'>Question #{index + 1}</span>: {question.title}
      </div>
      <div className='flex items-center gap-2'>
        <Link className='cursor-pointer hidden group-hover:flex hover:text-primary' href={`${path}/${question.id}/edit`}>
          <Pencil width={20} height={20} />
        </Link>
        <Dialog>
          <DialogTrigger>
            <button className='cursor-pointer hidden group-hover:flex hover:text-destructive'>
              <X width={20} height={20} />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this </DialogTitle>
            </DialogHeader>
            <DialogDescription>This action cannot be undone. This will permanently delete your question.</DialogDescription>
            <DialogFooter>
              <DialogClose>
                <Button onClick={handleDeleteQuestion} variant={"destructive"}>
                  Delete
                </Button>
                <Button variant={"ghost"}>Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuestionListBox;
