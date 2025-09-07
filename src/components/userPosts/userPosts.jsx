import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
// import style from "./UserPosts.module";

export default function UserPosts({ id }) {
  function userPosts() {
    return axios.get(
      `https://linked-posts.routemisr.com/users/${id}/posts`,
      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
  }

  let { data, isLoading, isFetching } = useQuery({
    queryKey: ["userPosts"],
    queryFn: userPosts,
    select: (data) => data?.data.posts,
    staleTime: 1000 * 60 * 5, 
    cacheTime: 1000 * 60 * 10, 
    refetchOnMount: false, 
    refetchOnWindowFocus: false,
  });
  console.log(data);

  return <div></div>;
}
