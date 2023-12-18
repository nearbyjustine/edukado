"use client";

import { fetchUserDetails } from "@/actions/fetch-user-details";
import { User } from "@/lib/collection.types";
import { AuthError } from "@supabase/supabase-js";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

const UserContext = async () => {
  const { user, error } = await fetchUserDetails();
  const Context = createContext(user);
  return { Context, user, error };
};

export const UserDetailsProvider = async ({ children }: { children: React.ReactNode }) => {
  const { Context, user, error } = await UserContext();

  return <Context.Provider value={user}>{children}</Context.Provider>;
};

export const useUserDetails = async () => {
  const { Context, user, error } = await UserContext();
  return useContext(Context);
};
