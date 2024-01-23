"use client";
import { logOut } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const LogoutButton = ({ className }: { className?: string }) => {
  const [loading, startTransition] = useTransition();

  const router = useRouter();

  const handleLogout = async () => {
    startTransition(async () => {
      const error = await logOut();
      // When logged out, load then redirect to landing page
      if (!error) {
        router.push("/");
      } else {
        // If error, log the error
        console.error(error);
      }
    });
  };

  return (
    <button className={className} disabled={loading} onClick={() => handleLogout()}>
      {loading ? "Loading..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
