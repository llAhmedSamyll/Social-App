import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
// import style from "./UserPosts.module";

export default function UserPosts({ id }) {
  function userPosts() {
    return axios.get(
      `https://linked-posts.routemisr.com/users/${id}/posts?limit=2`,
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
    staleTime: 1000 * 60 * 5, // يفضل يستخدم الكاش 5 دقايق
    cacheTime: 1000 * 60 * 10, // يخلي الكاش عايش 10 دقايق حتى لو مفيش كومبوننت
    refetchOnMount: false, // مش هيعمل refetch أوتوماتيك أول ما ترجع
    refetchOnWindowFocus: false, // مش هيعمل refetch أول ما تركز على التاب
  });
  console.log(data);

  return <div>{data}</div>;
}
