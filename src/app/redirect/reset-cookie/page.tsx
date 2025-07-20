"use client";

import { useLogoutUser } from "@/hooks";
import { useEffect } from "react";

export default function RedirectResetCookie() {
  useEffect(() => {
    const logoutUser = async () => {
      await useLogoutUser();
      window.location.href = "/";
    };
    logoutUser();
  }, []);

  return <></>;
}
