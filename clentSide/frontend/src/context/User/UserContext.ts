import { createContext } from "react";

export interface UserContextType {
  SignUp: (name: string, email: string, password: string) => Promise<unknown>;
  logIn: (email: string, password: string) => Promise<unknown>;
  getMe: () => Promise<unknown>;
  logout: () => Promise<unknown>;
  user: unknown;
}

const UserContext = createContext<UserContextType>({
  SignUp: async () => {},
  logIn: async () => {},
  logout: async () => {},
  getMe: async () => {},
  user: {},
});

export default UserContext;
