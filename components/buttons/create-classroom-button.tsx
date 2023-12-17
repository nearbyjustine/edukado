import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Classroom, GradeLevelEnum } from "@/lib/collection.types";
import { z } from "zod";
import { addClassroom } from "@/actions/section/add-classroom";
import { fetchClassroomOnId, fetchClassroomsOnGradeLevel } from "@/actions/section/fetch-classroom";
import capitalizeFirstLetter from "@/utils/capitalize";

const CreateClassroomSchema = z.object({
  grade_level: z.string({ required_error: "Grade level is required" }),
  section: z.string({ required_error: "Section is required" }),
  subject: z.string({ required_error: "Subject is required" }),
});

const CreateClassroomButton = () => {
  const [sections, setSections] = React.useState<Classroom[]>();
  const [sectionOpen, setSectionOpen] = React.useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = React.useState(false); // TO IMPLEMENT
  const [sectionValue, setSectionValue] = React.useState("");
  const [gradeLevelValue, setGradeLevelValue] = React.useState<GradeLevelEnum>("Grade 1");
  const [newSectionValue, setNewSectionValue] = React.useState("");
  const [newSectionError, setNewSectionError] = React.useState<string | null>(null);
  const [newSubjectError, setNewSubjectError] = React.useState<string | null>(null);
  const [isNewSectionButtonLoading, setIsNewSectionButtonLoading] = React.useState(false);
  const [isNewSubjectButtonLoading, setIsNewSubjectButtonLoading] = React.useState(false);

  useEffect(() => {
    const fetchSectionsByLevel = async () => {
      const { data, error } = await fetchClassroomsOnGradeLevel(gradeLevelValue);
      if (error && !data) {
        // TODO: gawa ka paraan para madisplay error
        console.error(error);
        return;
      }
      setSections(data);
      return;
    };

    fetchSectionsByLevel();
  }, [gradeLevelValue]);

  const handleNewSectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSectionValue(() => event.target.value);
  };

  const onSubmitNewSection = async () => {
    // server action -- insert a new section to database:
    setIsNewSectionButtonLoading((prev) => !prev);
    const data = await addClassroom({ grade_level: gradeLevelValue, section: capitalizeFirstLetter(newSectionValue) });
    if (data.error) {
      setNewSectionError(data.error.message);
      setIsNewSectionButtonLoading((prev) => !prev);
    }
    setSectionOpen((prev) => !prev);
    setIsNewSectionButtonLoading((prev) => !prev);
  };

  const onSubmitNewSubject = async () => {
    setIsNewSubjectButtonLoading((prev) => !prev);
    // const {data: classroom, error } = await fetchClassroomOnId()
    // const data = await addSubject({ grade_level: gradeLevelValue });
  };

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
          <DialogTitle>Create classroom</DialogTitle>
          <DialogDescription>Initialize your classroom here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='grade_level' className='text-right'>
              Grade Level
            </Label>
            <Select
              value={gradeLevelValue}
              onValueChange={async (value: GradeLevelEnum) => {
                setGradeLevelValue(value);
                setSectionValue("");
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
                {sectionValue ? sectionValue : "Select section..."}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
              <Command>
                <CommandInput onValueChange={(value) => setNewSectionValue(value)} placeholder='Enter section...' />
                <CommandEmpty className=''>
                  {/* THIS IS WHERE CREATE NEW SECTION BEGINS */}
                  <Dialog>
                    <DialogTrigger className='w-full'>
                      <div className='space-x-2 align-middle hover:bg-gray-200 px-4 py-2 w-full'>
                        <Plus width={15} height={15} className='inline-block' />
                        <p className='text-sm inline-block'>Create new section</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create section</DialogTitle>
                        <DialogDescription>This is where you'll create a section for your class (e.g. Grade 1 - Mabini). Save changes to add it.</DialogDescription>
                      </DialogHeader>
                      <div>
                        <div className='grid gap-4'>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='grade_level' className='text-right'>
                              Grade Level
                            </Label>
                            <Select
                              value={gradeLevelValue}
                              onValueChange={async (value: GradeLevelEnum) => {
                                setGradeLevelValue(value);
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
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='section_new' className='text-right'>
                          Section
                        </Label>
                        <Input value={newSectionValue} onChange={handleNewSectionChange} id='section_new' placeholder='Type section name here...' className='col-span-3' />
                      </div>
                      <DialogFooter>
                        <Button disabled={isNewSectionButtonLoading} onClick={onSubmitNewSection}>
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CommandEmpty>
                <CommandGroup>
                  {/* DITO UNG SECTIONS */}
                  {sections &&
                    sections.map((section) => (
                      <CommandItem
                        key={section.section}
                        value={section.section}
                        onSelect={(currentValue) => {
                          setSectionValue(capitalizeFirstLetter(currentValue));
                          setSectionOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", sectionValue === section.section ? "opacity-100" : "opacity-0")} />
                        {section.section}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {/* IMPLEMENT LATER: PAG PININDOT, LALABAS UNG DIALOG NG NEW SECTION */}
          {/* <div className='flex justify-end ml-[8.6rem] -z-0'>
            <button
              onClick={() => {
                setIsSectionDialogOpen((prev) => !prev);
              }}
            >
              <PlusCircle className='text-primary' />
            </button>
          </div> */}
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
