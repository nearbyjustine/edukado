import { fetchUserDetails } from "@/actions/fetch-user-details";
import CollapseSideBar from "@/components/collapse-from-sidebar";
import ProfileBar from "@/components/main-ui/profile-dropdown";
import Sidebar from "@/components/main-ui/sidebar";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, error, role } = await fetchUserDetails();
  return (
    <div>
      <Sidebar />
      <CollapseSideBar>
        {!error && <ProfileBar firstName={user.first_name} lastName={user.last_name} role={role} />}
        {children}
      </CollapseSideBar>
    </div>
  );
}
