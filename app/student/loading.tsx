import { Icons } from "@/components/ui/icons";
import React from "react";

const Loading = () => {
  return (
    <div className='text-center'>
      <Icons.spinner className='w-72 h-72 animate-spin text-primary mt-12' />
      <p className='animate-pulse text-2xl text-primary font-bold'>Loading...</p>
    </div>
  );
};

export default Loading;
