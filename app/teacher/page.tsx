import { fetchUserDetails } from "@/actions/fetch-user-details";
import LogoutButton from "@/components/buttons/logout-button";
import QuickBits from "@/components/main-ui/dashboard/quick-bits";
import { useAuth } from "@/components/providers/auth.providers";
import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";

const TeacherDashboardPage = async () => {
  return (
    <div>
      <QuickBits />
      <div></div>
    </div>
  );
};

export default TeacherDashboardPage;
