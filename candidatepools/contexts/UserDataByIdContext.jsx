import { createContext, useContext } from "react";

export const UserDataByIdContext = createContext(null);

export const useUserDataById = () => useContext(UserDataByIdContext);