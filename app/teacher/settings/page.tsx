import { fetchUserDetails } from "@/actions/fetch-user-details-browser";
import { SettingsForm } from "@/components/forms/settings-form";
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
    <div>
      <h1 className='font-semibold text-xl'>Your profile information</h1>
      <p className='text-accent-foreground text-sm'>This is where you can edit your user information. This is confidential and will not be distributed.</p>
      <SettingsForm className='w-[20rem]' />
    </div>
  );
};

export default SettingsPage;
