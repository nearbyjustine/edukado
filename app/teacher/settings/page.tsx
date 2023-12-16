import { SettingsForm } from "@/components/forms/settings-form";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";

const SettingsPage = async () => {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!error && user) {
    const { data: userDetails, error: userDetailsError } = await supabase.from("profiles").select().eq("id", user.id).single();
    if (!userDetailsError && userDetails) {
      return (
        <div>
          <SettingsForm userDetails={userDetails} />
        </div>
      );
    }
  }
  return <div>Something went wrong</div>;
};

export default SettingsPage;
