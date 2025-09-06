import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function AddComment({ postId }) {
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
        <button
          onClick={() => setOpen(true)}
          className="rounded-md  hover:bg-[#eee]  bg-[#FEE2E2] py-1  border-[#b4b4b4] border-dashed  border-1 px-4 cursor-pointer text-[#485571]"
        >
          Add Comment...
        </button>

        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-50 grid h-screen w-screen place-items-center  
        bg-black/60 backdrop-blur-sm transition-opacity duration-300 
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Modal */}
          <div
            className={`bg-[#F1EEE7] rounded-xl shadow-lg max-w-md w-full p-6 transform mt-[-200px] transition-all duration-300
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          >
            <h2 className="text-xl font-bold mb-4">Add comment</h2>
            <form onSubmit={handleSubmit(creatComment)}>
              <textarea
                {...register("content")}
                type="text"
                placeholder="Write a comment"
                className=" bg-[#efefef] w-full p-2 rounded mb-3"
              />
              <input {...register("post")} type="hidden" />

              <div className="flex justify-between mt-4">
                <>
                  <button
                    onClick={() => setOpen(false)}
                    type="submit"
                    className="bg-[#111827] cursor-pointer text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-red-600 cursor-pointer flex items-center text-white px-4 py-2 rounded"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
