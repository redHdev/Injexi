"use client";

import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children, ...props }) => {
  return <SessionProvider {...props}>{children}</SessionProvider>;
};
