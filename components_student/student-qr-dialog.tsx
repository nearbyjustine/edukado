"use client";

import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/collection.types";
import { redirectToSubjectPageActionStudent } from "@/actions/redirect-to-subject-page";
import QRCode from "react-qr-code";

const StudentQRDialog = ({ subjectId, userId, classroomId }: { subjectId: string; userId: string; classroomId: string }) => {
  const QRInfoJSON = JSON.stringify({
    subjectId,
    userId,
    classroomId,
  });
  return (
    <Dialog
      onOpenChange={() => {
        redirectToSubjectPageActionStudent(subjectId);
      }}
    >
      <DialogTrigger>
        <Button className='text-xl font-bold'>QR Code</Button>
      </DialogTrigger>
      <DialogContent>
        <div>{<QRCode value={QRInfoJSON} />}</div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentQRDialog;
