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
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/fetch-self`, {
    cache: "no-cache",
  });

  console.log(await response.json());

  return <div>{/* <SettingsForm userDetails={userDetails} /> */}</div>;
  return <div>Something went wrong</div>;
};

export default SettingsPage;
