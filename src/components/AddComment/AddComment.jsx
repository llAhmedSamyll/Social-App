import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddComment({ postId }) {
  const form = useForm({
    defaultValues: {
      content: "",
      post: postId,
    },
  });
  const { register, handleSubmit, reset } = form;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function creatComment(data) {
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
        setMessage("✅ Comment added successfully!");
      } else {
        setMessage("❌ Failed to add comment.");
      }
    } catch (err) {
      setMessage("⚠️ Error occurred!");
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
            className={`bg-[#F1EEE7] rounded-xl shadow-lg max-w-md w-full p-6 transform transition-all duration-300
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
              {message && (
                <div
                  className="flex  items-center py-1 px-4 mx-auto w-fit  text-yellow-400 rounded-lg bg-[#111827] animate-pulse"
                  role="alert"
                >

                  <span className="sr-only">Info</span>
                  <div className="ms-3  text-sm font-medium">
                    {message}
                  </div>
                </div>
              )}
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-[#111827] cursor-pointer text-white px-4 py-2 rounded"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
