import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext } from "react";

export const UserDataContext = createContext();

export default function UserDataContextProvider(props) {
  function getUserData() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

let { data, isLoading, error } = useQuery({
  queryKey: ["UserDataContext"],
  queryFn: getUserData,
  select : (data) => data?.data?.user,
  refetchInterval: 1000,

});


  return (
    <UserDataContext.Provider value={{ data }}>
      {props.children}
    </UserDataContext.Provider>
  );
}
