"use client";

import React from "react";
import { UserDetailsProvider } from "./userDetailsProvider";

const UserProviders = ({ children }: { children: React.ReactNode }) => {
  return <UserDetailsProvider>{children}</UserDetailsProvider>;
};

export default UserProviders;
