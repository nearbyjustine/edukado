import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const sections = [
  {
    value: "maharlika",
    label: "Maharlika",
  },
  {
    value: "mabantot",
    label: "Mabantot",
  },
];

type GradeLevelType = "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | "Grade 5" | "Grade 6";

const CreateClassroomButton = () => {
  const [sectionOpen, setSectionOpen] = React.useState(false);
  const [sectionValue, setSectionValue] = React.useState("");
  const [gradeValue, setGradeValue] = React.useState<GradeLevelType>("Grade 1");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='flex gap-2 justify-center items-center px-4 bg-green-500 hover:bg-green-600 transition-colors rounded-full text-white '>
          <PlusCircle className='' width={20} height={20} />
          <p className='font-semibold text-xl'>Add Classroom</p>
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='grade_level' className='text-right'>
              Grade Level
            </Label>
            <Select
              onValueChange={async (value: GradeLevelType) => {
                setGradeValue(value);
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select grade level' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select grade level</SelectLabel>
                  <SelectItem value='Grade 1'>Grade 1</SelectItem>
                  <SelectItem value='Grade 2'>Grade 2</SelectItem>
                  <SelectItem value='Grade 3'>Grade 3</SelectItem>
                  <SelectItem value='Grade 4'>Grade 4</SelectItem>
                  <SelectItem value='Grade 5'>Grade 5</SelectItem>
                  <SelectItem value='Grade 6'>Grade 6</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='section' className='text-right'>
            Section
          </Label>
          <Popover open={sectionOpen} onOpenChange={setSectionOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' role='combobox' aria-expanded={sectionOpen} className='w-[200px] justify-between'>
                {sectionValue ? sections.find((section) => section.value === sectionValue)?.label : "Select section..."}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
              <Command>
                <CommandInput placeholder='Enter section...' />
                <CommandEmpty className=''>
                  <Dialog>
                    <DialogTrigger className='w-full'>
                      <button className='space-x-2 align-middle hover:bg-gray-200 px-4 py-2 w-full'>
                        <Plus width={15} height={15} className='inline-block' />
                        <p className='text-sm inline-block'>Create new section</p>
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                        <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CommandEmpty>
                <CommandGroup>
                  {sections.map((section) => (
                    <CommandItem
                      key={section.value}
                      value={section.value}
                      onSelect={(currentValue: any) => {
                        console.log(currentValue);
                        setSectionValue(currentValue === sectionValue ? "" : currentValue);
                        setSectionOpen(false);
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", sectionValue === section.value ? "opacity-100" : "opacity-0")} />
                      {section.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='subject' className='text-right'>
            Subject
          </Label>
          <Input id='subject' placeholder='Type subject name here...' className='col-span-3' />
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassroomButton;
