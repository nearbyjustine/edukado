"use client";

import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import Papa from "papaparse";
import { createClient } from "@/utils/supabase/client";

type EmailAndPassword = {
  email: string;
  password: string;
};

const ImportTeachersButton = () => {
  //State to store the values
  const [values, setValues] = useState<EmailAndPassword[]>([]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      Papa.parse<EmailAndPassword>(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setValues(results.data);
        },
      });
    }
  };

  const importTeachers = () => {
    const supabase = createClient();
    if (values) {
      values.map(async (v) => {
        const { error } = await supabase.rpc("create_user_teacher", { email: v.email, password: v.password });
        if (error) return console.error(error);
      });
    } else {
      console.error("empty or incorrect csv format");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className='flex gap-2 justify-center items-center py-2 px-2 md:px-4 bg-green-500 hover:bg-green-600 transition-colors rounded-full text-white '>
            <PlusCircle className='' width={20} height={20} />
            <p className='font-semibold hidden md:block text-xl'>Import Teachers</p>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Input type='file' name='file' onChange={changeHandler} accept='.csv' />
          <Button onClick={importTeachers} className='flex gap-2 justify-center items-center py-2 px-2 md:px-4 bg-green-500 hover:bg-green-600 transition-colors rounded-full text-white '>
            <p className='font-semibold hidden md:block text-xl'>Import Teachers</p>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportTeachersButton;
