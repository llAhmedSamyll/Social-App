import { QueryClient, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UserDataContext } from "../Context/UserDataContext";

export default function AddComment({ postId }) {
  let queryClient = useQueryClient();
  let { data } = useContext(UserDataContext);
  const [isload, setisload] = useState(false);

  const form = useForm({
    defaultValues: {
      content: "",
      post: postId,
    },
  });
  const { register, handleSubmit, reset } = form;
  let toastId;

useEffect(() => {
  if (postId) {
    reset({ content: "", post: postId });
  }
}, [postId, reset]);

async function creatComment(data) {
  toastId = toast.loading("Adding comment...");
  setisload(true);
  try {
    let res = await axios.post(
      "https://linked-posts.routemisr.com/comments",
      data,
      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
    if (res.data.message === "success") {
      setisload(false);
      toast.success("Comment added successfully!", { id: toastId });
      reset({ content: "", post: postId }); 
      queryClient.invalidateQueries({ queryKey: ["getcomments"] });
    } else {
      setisload(false);
      toast.error("Failed to add comment.", { id: toastId });
    }
  } catch (err) {
    setisload(false);
    toast.error("Error occurred!", { id: toastId });
  }
}

  return (
    <>
      <div>
        <div>
          <form
            onSubmit={handleSubmit(creatComment)}
            className=" flex items-center p-3 rounded-b-2xl bg-[#E8E8E8]   "
          >
            <div className="w-full">
              <input
                dir="auto"
                {...register("content")}
                type="text"
                placeholder={"Comment as " + data?.name}
                className=" bg-[#fffbf3] w-full text-lg  block  p-2 border-[#a2a2a2]  rounded-2xl "
              />
              <input {...register("post")}   type="hidden" />
            </div>

            <div className=" px-2  ">
              <button
                disabled={isload}
                type="submit"
                className="flex items-center cursor-pointer  "
              >
                {isload ? (
                  <i className="fa-solid fa-spinner fa-spin-pulse text-blue-600 text-lg "></i>
                ) : (
                  <i className="fa-solid fa-paper-plane rotate-45 hover:text-blue-400 text-blue-600 text-lg "></i>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
