import { createContext } from 'react';

const UserContext = createContext({
  user: { id: null, isAdmin: null },
  setUser: () => {},
  unsetUser: () => {},
});

export const UserProvider = UserContext.Provider;
export default UserContext;
