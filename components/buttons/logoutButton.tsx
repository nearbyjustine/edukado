"use client";
import { logOut } from "@/actions/logout";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const LogoutButton = () => {
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
        console.log(error);
      }
    });
  };

  return (
    <Button disabled={loading} onClick={() => handleLogout()}>
      {loading ? "Loading..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;
