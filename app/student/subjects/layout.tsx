import { IsActivityModalOpenProvider } from "@/components/providers/activityModalProvider";

export default async function SubjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <IsActivityModalOpenProvider>{children}</IsActivityModalOpenProvider>
    </div>
  );
}
