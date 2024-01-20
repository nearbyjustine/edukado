import { fetchUserDetails } from "@/actions/fetch-user-details-browser";
import { SettingsForm } from "@/components/forms/settings-form";
import StudentSettingsForm from "@/components_student/forms/student-settings-form";
import { User } from "@/lib/collection.types";
import { createClient } from "@/utils/supabase/server";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import React from "react";

type UserResponse =
  | {
      user: User | null;
      status: number;
    }
  | {
      error: PostgrestError | AuthError | null;
      status: number;
    };

const SettingsPage = async () => {
  return (
    <div className='flex gap-4'>
      <div>
        <div className='w-[25rem]'>
          <h1 className='font-semibold text-xl'>Your profile information</h1>
          <p className='text-accent-foreground text-sm'>This is where you can edit your user information. This is confidential and will not be distributed.</p>
        </div>
        <SettingsForm className='w-[20rem]' />
      </div>
      <div>
        <h1 className='font-semibold text-xl'>Your student information</h1>
        <p className='text-accent-foreground text-sm'>This is where you can edit your student information.</p>
        <div className='mt-10 pb-10'>
          <StudentSettingsForm />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
