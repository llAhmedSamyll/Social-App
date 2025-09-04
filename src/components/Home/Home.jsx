import { useQuery } from "@tanstack/react-query";
import style from "./Home.module.css";
import axios from "axios";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import AddComment from "../AddComment/AddComment";
import { useEffect, useState } from "react";
import Upbutton from "../Upbutton/Upbutton";

export default function Home() {
  function getAllPosts() {
    return axios.get("https://linked-posts.routemisr.com/posts?limit=50", {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  let { data, isError, isFetching, isLoading, error } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,
    staleTime: 1000 * 60 * 5, // يفضل يستخدم الكاش 5 دقايق
    cacheTime: 1000 * 60 * 10, // يخلي الكاش عايش 10 دقايق حتى لو مفيش كومبوننت
  });
  // console.log(data?.data?.posts);

  return (
    <>
      <div className={`${style.Home} min-h-screen pt-10 px-4 `}>
        {isFetching ? (
          <>
            <div
              aria-label="Loading..."
              role="status"
              className="flex  flex-col justify-center mt-32 space-y-4 items-center space-x-2"
            >
              <svg
                className="h-20 w-20 animate-spin stroke-gray-500"
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
              <span className="text-gray-500 text-lg font-medium">
                Loading...
              </span>
            </div>
          </>
        ) : (
          ""
        )}

        {data?.data?.posts?.map((post) => (
          <div key={post.id}>
            <div className="my-4 ">
              <div className="bg-[#f1eee7] rounded-xl overflow-hidden shadow-md p-2 h-fit container flex flex-col justify-center mx-auto max-w-2xl ">
                <Link to={`./postdetails/${post.id}`}>
                  <div className="p-4">
                    <div className="flex items-center gap-2.5 ">
                      <div className="size-12 rounded-full overflow-hidden bg-white  flex items-center">
                        <img
                          className="w-[100%]"
                          src={post.user.photo}
                          alt=""
                        />
                      </div>
                      <div className="flex flex-wrap flex-col ">
                        <h3 className="font-medium text-lg">
                          {post.user.name}
                        </h3>
                        <span className="text-sm text-teal-600  ">
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-5">
                      <p dir="auto">{post.body}</p>
                    </div>
                  </div>
                  <div className="flex justify-center overflow-hidden bg-white rounded-xl ">
                    <img className="w-100" src={post.image} alt="" />
                  </div>
                  <hr className="border-gray-300 mt-5" />

                  <Comment comments={post.comments?.[0]} />
                </Link>
                <AddComment postId={post?.id} />
              </div>
            </div>
          </div>
        ))}

        <div className="py-20"></div>
        <Upbutton />
      </div>
    </>
  );
}
