import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  ready: false
});

export function useUser() {
  return useContext(UserContext);
}

export function UserContextProvider({children}) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      axios.get('/profile').then(({data}) => {
        setUser(data);
        setReady(true);
      }).catch(() => {
        setReady(true);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{user, setUser, ready}}>
      {children}
    </UserContext.Provider>
  );
}