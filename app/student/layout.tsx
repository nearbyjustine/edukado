import { fetchUserDetails } from "@/actions/fetch-user-details";
import CollapseSideBar from "@/components_student/collapse-from-sidebar";
import ProfileBar from "@/components_student/main-ui/profile-dropdown";
import Sidebar from "@/components_student/main-ui/sidebar";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, error, role, avatar_url } = await fetchUserDetails();
  return (
    <div>
      <Sidebar />
      <CollapseSideBar>
        {!error && <ProfileBar avatarUrl={avatar_url} firstName={user.first_name} lastName={user.last_name} role={role} />}
        <main className='mx-2 my-6'>{children}</main>
      </CollapseSideBar>
    </div>
  );
}
