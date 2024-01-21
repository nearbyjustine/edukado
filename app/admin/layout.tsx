import { fetchUserDetails } from "@/actions/fetch-user-details";
import CollapseSideBar from "@/components/collapse-from-sidebar-admin";
import ProfileBar from "@/components/main-ui/profile-dropdown-admin";
import Sidebar from "@/components/main-ui/sidebar-admin";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, error, role, avatar_url } = await fetchUserDetails();
  return (
    <div>
      <Sidebar />
      <CollapseSideBar>
        {!error && <ProfileBar avatarUrl={avatar_url} firstName={"Admin"} lastName={"Central I"} role={"Admin"} />}
        <main className='w-full mx-2 my-6'>{children}</main>
      </CollapseSideBar>
    </div>
  );
}
