import { fetchSubjectById } from "@/actions/section/fetch-subject";
import Activity from "@/components/main-ui/subject/activity";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const subject = await fetchSubjectById(params.id);
  if (subject.error || !subject.data) {
    return <div>Error: Something must have happened</div>;
  }
  const classroom = subject.data.classrooms;

  return (
    <div>
      <div>Hi welcome to subject: {params.id}</div>
      <div className='flex flex-col gap-4'>
        <div className='relative bg-green-500 text-white dark:bg-green-600 dark:text-white rounded-md transition-colors flex flex-col justify-end h-32 py-2 px-4'>
          <div className='font-bold text-2xl'>{subject.data.name}</div>
          <div className='font-medium '>{`${classroom?.grade_level} - ${classroom?.section}`}</div>
          <div className='absolute bottom-2 right-2'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className='hover:bg-primary/80 hover:scale-[1.1] transition-transform'>
                  <PlusCircle className='text-white' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className='select-none'>Create an activity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='w-40'>Exam</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <Activity name='Owen Harvey B.' activity='Activity 1: Arithmetic' date='Nov 19, 2023' />
          <Activity name='Owen Harvey B.' activity='Activity 2: Algebra' date='Nov 20, 2023' />
          <Activity name='Owen Harvey B.' activity='Activity 3: Linear Equation' date='Nov 21, 2023' />
          <Activity name='Owen Harvey B.' activity='Activity 4: Do the thing?' date='Nov 21, 2023' />
          <Activity name='Owen Harvey B.' activity='Activity 5: Observation Worksheet' date='Nov 23, 2023' />
        </div>
      </div>
    </div>
  );
}
