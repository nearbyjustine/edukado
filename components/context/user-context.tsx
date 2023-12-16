import { fetchUserDetails } from "@/actions/fetch-user-details";
import { createContext } from "react";

export const UserContext = async () => {
  const { user, error } = await fetchUserDetails();
  const Context = createContext(user);
  return { Context, user, error };
};
