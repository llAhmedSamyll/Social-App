import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comment from "../Comment/Comment";
import style from "./PostDetails.module.css";
import AddComment from "../AddComment/AddComment";
import Upbutton from "../Upbutton/Upbutton";

export default function PostDetails() {
  let { id } = useParams();

  function getPostDetails() {
    return axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  let { data, isLoading, isFetching } = useQuery({
    queryKey: ["getcomments"],
    queryFn: getPostDetails,
    refetchInterval: 10000,
    select: (data) => data?.data.post,
  });

  return (
    <>
      <div className={`${style.PostDetails} min-h-screen pt-10 px-4 `}>
        {isFetching ? (
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
          </div>
        ) : (
          ""
        )}
        <div className="bg-[#f1eee7] rounded-xl overflow-hidden shadow-md p-2 h-fit container flex flex-col justify-center mx-auto max-w-2xl ">
          <div className="p-4">
            <div className="flex items-center gap-2.5 ">
              <div className="size-12 rounded-full overflow-hidden bg-white  flex items-center">
                <img className="w-[100%]" src={data?.user.photo} alt="" />
              </div>
              <div className="flex flex-wrap flex-col ">
                <h3 className="font-medium text-lg">{data?.user.name}</h3>
                <span dir="ltr" className="text-sm text-left text-teal-600  ">
                  {new Date(data?.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-5">
              <p dir="auto">{data?.body}</p>
            </div>
          </div>
          <div className="flex justify-center overflow-hidden bg-white rounded-xl ">
            <img className="w-100" src={data?.image} alt="" />
          </div>
          <hr className="border-gray-300 mt-5" />

          <AddComment postId={data?.id} />
          {data?.comments.map((comment) => (
            <Comment key={comment._id} comments={comment}></Comment>
          ))}
        </div>
        <div className="py-10"></div>
          <Upbutton/>
      </div>
    </>
  );
}
