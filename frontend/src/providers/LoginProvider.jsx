import { useContext, useState, createContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LoginPage from "../pages/Login";
import {
  AIRTABLE_API_KEY_SESSION_STORAGE,
  AIRTABLE_BASE_KEY_SESSION_STORAGE,
} from "../service/airtable";

const UserContext = createContext({ data: undefined, login: () => {} });

export default function UserProvider({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    const { key, base } = getKeys();

    if (key || base) setUser({ key, base });
  }, []);

  return (
    <UserContext.Provider
      value={{
        data: user,
        login: ({ key, base }) => {
          sessionStorage.setItem(AIRTABLE_API_KEY_SESSION_STORAGE, key);
          sessionStorage.setItem(AIRTABLE_BASE_KEY_SESSION_STORAGE, base);
          setUser({ key, base });
        },
        logout: () => {
          unsetKeys();
          setUser(undefined);
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function unsetKeys() {
  sessionStorage.removeItem(AIRTABLE_API_KEY_SESSION_STORAGE);
  sessionStorage.removeItem(AIRTABLE_BASE_KEY_SESSION_STORAGE);
}

export function getKeys() {
  const key = sessionStorage.getItem(AIRTABLE_API_KEY_SESSION_STORAGE);
  const base = sessionStorage.getItem(AIRTABLE_BASE_KEY_SESSION_STORAGE);
  return { key, base };
}

export function useUser() {
  return useContext(UserContext);
}

export function LoginRoute() {
  const { data } = useUser();

  if (data) {
    return <Outlet />;
  }
  return <LoginPage />;
}
