import { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export default function UserContextProvider(props) {
  const [userToken, setuserToken] = useState(localStorage.getItem("userToken"));

  return (
    <UserContext.Provider value={{userToken, setuserToken}}>
      {props.children}
    </UserContext.Provider>
  );
}
