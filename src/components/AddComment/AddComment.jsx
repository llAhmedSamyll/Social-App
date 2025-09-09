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


  const form = useForm({
    defaultValues: {
      content: "",
      post: postId,
    },
  });
  const { register, handleSubmit, reset } = form;
  const [open, setOpen] = useState(false);
  let toastId;

  async function creatComment(data) {
    toastId = toast.loading("Adding comment...");
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
        toast.success("Comment added successfully!", { id: toastId });
        queryClient.invalidateQueries({ queryKey: ["getcomments"] });
      } else {
        toast.error("Failed to add comment.", { id: toastId });
      }
    } catch (err) {
      toast.error("Error occurred!", { id: toastId });
    }
  }

  useEffect(() => {
    reset({
      content: "",
      post: postId,
    });
  }, [postId, reset]);

  return (
    <>
      <div className=" py-2 ">
        <div>
          <form onSubmit={handleSubmit(creatComment)}  className=" flex items-center p-3 rounded-b-2xl bg-[#d6d6d6]   " >
            <div className="w-full">
              <input
              dir="auto"
                {...register("content")}
                type="text"
                placeholder={ "Comment as " +  data.name}
                className=" bg-[#fffbf3] w-full text-lg  block  p-3 border-[#a2a2a2]  rounded-2xl "
              />
              <input {...register("post")} type="hidden" />
            </div>

            <div className=" px-2  ">
              <button
                type="submit"
                className="flex items-center "
              >
                <i className="fa-solid fa-paper-plane rotate-45 text-blue-600 text-lg "></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
