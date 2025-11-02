"use client";

import { createContext, useEffect, useState } from "react";

export interface UserDetailType {
  name: string;
  email: string;
  picture: string;
  uid: string;
}

interface UserDetailsContextType {
  userDetail: UserDetailType | null;
  setUserDetail: (user: UserDetailType | null) => void;
}

export const UserDetailContext = createContext<UserDetailsContextType>({
  userDetail: null,
  setUserDetail: () => {},
});
