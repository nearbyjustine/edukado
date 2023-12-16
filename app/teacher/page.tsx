import { fetchUserDetails } from "@/actions/fetch-user-details";
import LogoutButton from "@/components/buttons/logoutButton";
import { useAuth } from "@/components/providers/auth.providers";
import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";

const TeacherDashboardPage = async () => {
  return (
    <div>
      <div></div>
      <LogoutButton />
    </div>
  );
};

export default TeacherDashboardPage;
