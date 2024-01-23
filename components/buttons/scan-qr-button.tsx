"use client";

import { Html5QrcodeResult, Html5Qrcode, CameraDevice } from "html5-qrcode";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { setConstantValue } from "typescript";
import { createClient } from "@/utils/supabase/client";
import { Student } from "@/lib/collection.types";
import Image from "next/image";
import { format } from "date-fns";

type QRResponse = {
  subjectId: string;
  userId: string;
  classroomId: string;
};

export const ScanQRButton = ({ subjectId }: { subjectId: string }) => {
  const [cameras, setCameras] = useState<CameraDevice[]>();
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [student, setStudent] = useState<Student>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const requestCameraPermission = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices.length === 0) throw Error("No camera found");
      setCameras(devices);
    } catch (e) {
      console.error(e);
    }
  };

  const selectCamera = (cameraId: string) => {
    setSelectedCamera(cameraId);
  };

  const handleQRread = async (text: string, result: Html5QrcodeResult, scanner: Html5Qrcode) => {
    try {
      setErrorMessage(undefined);
      // console.log(text, result);

      // parse mo ung result/text
      const student: QRResponse = await JSON.parse(text);

      if (student.subjectId !== subjectId) {
        throw Error("Wrong QR Code use for subject");
      }

      //fetch mo ung student
      const supabase = createClient();
      const { data, error } = await supabase.from("students").select("*, profiles!students_id_fkey(*)").eq("id", student.userId).single();

      if (error || !data) {
        throw Error(error.message);
      }

      // check mo kung nakapag attendance na
      const dateTodayFirst = format(new Date(), "yyyy-MM-dd") + " 00:00:00";
      const dateTodayLast = format(new Date(), "yyyy-MM-dd") + " 23:59:59";

      console.log(dateTodayFirst, dateTodayLast, new Date());
      const { data: attendedData, error: attendedError } = await supabase
        .from("attendance")
        .select()
        .eq("student_id", student.userId)
        .eq("subject_id", subjectId)
        .lt("created_at", dateTodayLast)
        .gt("created_at", dateTodayFirst);

      if (attendedError) throw Error(attendedError.message);

      if (attendedData.length > 0) {
        throw Error("Already had attendance to this subject");
      } else {
        // insert data to attendance
        const { error: insertError } = await supabase.from("attendance").insert({ student_id: student.userId, subject_id: subjectId, classroom_id: student.classroomId });
        if (insertError) {
          throw Error(insertError.message);
        }
      }

      setStudent(data);
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      }
      // console.error(e);
    }
  };

  const handleQRScan = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qrBox");

      html5QrCode.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText, result) => {
          handleQRread(decodedText, result, html5QrCode);
          html5QrCode.pause(true);
        },
        (errorMessage) => {
          // parse error, ignore it.
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Dialog
        onOpenChange={() => {
          setSelectedCamera("");
          setStudent(undefined);
          setErrorMessage(undefined);
        }}
      >
        <DialogTrigger>
          <Button className='text-xl font-bold'>Scan QR Code</Button>
        </DialogTrigger>
        <DialogContent>
          <div className='flex flex-col items-center  gap-3'>
            <div id='qrBox' className='w-2/3'></div>
            {!cameras && (
              <Button className='w-2/3' onClick={requestCameraPermission}>
                Request Camera Permission
              </Button>
            )}
            {cameras && (
              <Select onValueChange={selectCamera}>
                <SelectTrigger className='w-2/3'>
                  <SelectValue placeholder='Select Camera' />
                </SelectTrigger>
                <SelectContent>
                  {cameras.map((cam) => (
                    <SelectItem key={cam.id} value={cam.id}>
                      {cam.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedCamera && (
              <Button onClick={handleQRScan} className='w-2/3'>
                Start Scanning
              </Button>
            )}
            {student && student.profiles && (
              <div>
                <div>
                  {student.profiles.first_name} {student.profiles.last_name}
                </div>
                <Image width={100} height={100} alt={`${student.profiles.first_name}'s profile picture`} src={student.profiles?.avatar_url} />
              </div>
            )}
            {errorMessage && <div className='text-destructive font-bold'>{errorMessage}</div>}
          </div>
        </DialogContent>
      </Dialog>
      <div id='reader'></div>
    </div>
  );
};
