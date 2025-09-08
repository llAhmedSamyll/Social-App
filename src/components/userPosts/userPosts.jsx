import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { Link } from "react-router-dom";
import AddComment from "../AddComment/AddComment";
import Comment from "../Comment/Comment";
import UpdatePost from "../UpdatePost/UpdatePost";
import DeletePost from "../DeletePost/DeletePost";
// import style from "./UserPosts.module";

export default function UserPosts({ id }) {
  dayjs.extend(relativeTime);

  function userPosts() {
    return axios.get(`https://linked-posts.routemisr.com/users/${id}/posts`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  let { data, isLoading, isFetching } = useQuery({
    queryKey: ["userPosts"],
    queryFn: userPosts,
    select: (data) => {
      return data?.data?.posts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnMount: false, 
    refetchOnWindowFocus: false,
  });
  // console.log(data);

  return (
    <>
      {isLoading ? (
        <div
          aria-label="Loading..."
          role="status"
          className="flex  flex-col justify-center my-5 space-y-2 items-center "
        >
          <svg
            className="h-10 w-10 animate-spin stroke-gray-500"
            viewBox="0 0 256 256"
          >
            <line
              x1={128}
              y1={32}
              x2={128}
              y2={64}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={24}
            />
            <line
              x1="195.9"
              y1="60.1"
              x2="173.3"
              y2="82.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={24}
            />
            <line
              x1={224}
              y1={128}
              x2={192}
              y2={128}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={24}
            />
            <line
              x1="195.9"
              y1="195.9"
              x2="173.3"
              y2="173.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={24}
            />
            <line
              x1={128}
              y1={224}
              x2={128}
              y2={192}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={24}
            />
            <line
              x1="60.1"
              y1="195.9"
              x2="82.7"
              y2="173.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={24}
            />
            <line
              x1={32}
              y1={128}
              x2={64}
              y2={128}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={24}
            />
            <line
              x1="60.1"
              y1="60.1"
              x2="82.7"
              y2="82.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={24}
            />
          </svg>
          <h1>Loading your posts</h1>
        </div>
      ) : (
        ""
      )}
      {data?.map((post) => (
        <div key={post._id}>
          <div className="my-4">
            <div className="bg-[#f1eee7] rounded-xl overflow-hidden shadow-md p-2 h-fit container flex flex-col justify-center mx-auto max-w-2xl">
              <div className="p-4">
                <div className="flex relative items-center gap-2.5">
                  <div className="size-12 rounded-full overflow-hidden bg-white flex items-center">
                    <img
                      className="w-full"
                      src={post.user.photo}
                      alt={post.user.name}
                    />
                  </div>
                  <div className="flex flex-wrap flex-col">
                    <h3 className="font-medium text-lg">{post.user.name}</h3>
                    <span dir="ltr" className="text-sm text-left text-teal-600">
                      {dayjs(post.createdAt).fromNow()}
                    </span>
                  </div>
                  <span >
                     <UpdatePost data={post} />
                  </span>
                  <span >
                     <DeletePost id={post.id} />
                  </span>
                </div>
              </div>
              <Link to={`/postdetails/${post._id}`}>
                <div className="pt-5">
                  <p dir="auto">{post.body}</p>
                </div>
                {post.image && (
                  <div className="flex justify-center overflow-hidden bg-white rounded-xl">
                    <img className="w-full" src={post.image} alt="" />
                  </div>
                )}
                <hr className="border-gray-300 mt-5" />

                <Comment comments={post?.comments?.[0]} />
              </Link>
              <AddComment postId={post?._id} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
