import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleUser, CircleUserRound, School2 } from "lucide-react";
import React from "react";

const AdminPage = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='flex gap-4'>
        <Card className='bg-primary text-primary-foreground'>
          <CardHeader>
            <CardTitle className='font-bold'>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center items-center gap-6'>
              <CircleUserRound width={75} height={75} strokeWidth={1.5} />
              <div className='font-bold text-xl bg-primary-foreground text-primary py-2 px-4  rounded-md'>784 Students</div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-primary text-primary-foreground'>
          <CardHeader>
            <CardTitle className='font-bold'>Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center items-center gap-6'>
              <CircleUser width={75} height={75} strokeWidth={1.5} />
              <div className='font-bold text-xl bg-primary-foreground text-primary py-2 px-4  rounded-md'>16 Teachers</div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-primary text-primary-foreground'>
          <CardHeader>
            <CardTitle className='font-bold'>Total Classrooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center items-center gap-6'>
              <School2 width={75} height={75} strokeWidth={1.5} />
              <div className='font-bold text-xl bg-primary-foreground text-primary py-2 px-4  rounded-md'>32 classrooms</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
