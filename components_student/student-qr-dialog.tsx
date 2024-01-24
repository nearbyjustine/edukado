"use client";

import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/collection.types";
import { redirectToClassroomActionStudent } from "@/actions/redirect-to-subject-page";
import QRCode from "react-qr-code";

const StudentQRDialog = ({ userId, classroomId }: { userId: string; classroomId: string }) => {
  const QRInfoJSON = JSON.stringify({
    userId,
    classroomId,
  });
  return (
    <Dialog
      onOpenChange={() => {
        redirectToClassroomActionStudent();
      }}
    >
      <DialogTrigger>
        <Button className='text-xl font-bold'>QR Code</Button>
      </DialogTrigger>
      <DialogContent>
        <div className='w-full flex justify-center items-center'>{<QRCode value={QRInfoJSON} />}</div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentQRDialog;
