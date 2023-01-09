import { createContext, useState } from "react";

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  currentChannel: null,
  setCurrentChannel: () => null,
});

export const UserProvider = ({ children }) => {
  //{ id: -1, user_name: "", email: "", avatar: null}
  const [currentUser, setCurrentUser] = useState(null);

  //{ channel_id: 0, channel_name: "" }
  const [currentChannel, setCurrentChannel] = useState(null);

  const value = {
    currentUser,
    setCurrentUser,
    currentChannel,
    setCurrentChannel,
  };

  return (
    <UserContext.Provider value={value}> {children} </UserContext.Provider>
  );
};
