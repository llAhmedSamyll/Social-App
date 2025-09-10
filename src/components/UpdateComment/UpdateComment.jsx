import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
export default function UpdateComment({ id }) {
  const [open, setOpen] = useState(false);
  const [isload, setisload] = useState(false);

  let queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      content: "",
    },
  });
  const { register, handleSubmit } = form;
  let toastId;

  async function editeComment(data) {
    toastId = toast.loading("Editing comment...");
    setisload(true);
    try {
      let res = await axios.put(
        `https://linked-posts.routemisr.com/comments/${id}`,
        data,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );
      if (res.data.message === "success") {
        setisload(false);
        toast.success("successfully!", { id: toastId });
        queryClient.invalidateQueries({ queryKey: ["getcomments"] });
        setOpen(false);
      } else {
        setisload(false);
        toast.error("Failed to edite comment.", { id: toastId });
      }
    } catch (err) {
      setisload(false);

      toast.error("Error occurred!", { id: toastId });
    }
  }

  return (
    <>
      <div className="  flex justify-center ">
        <button
          onClick={() => setOpen(true)}
          className="  hover:bg-[#cfcfcf] px-4 cursor-pointer w-full p-1 text-[#485571]"
        >
          Edit
        </button>

        {/* Backdrop */}
        <div
          className={`fixed inset-0  z-50 grid h-screen w-screen place-items-center  
        bg-black/60 backdrop-blur-sm transition-opacity duration-300 
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Modal */}
          <div
            className={`bg-[#F1EEE7] rounded-xl shadow-lg max-w-md w-full p-6 transform mt-[-200px] transition-all duration-300
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          >
            <h2 className="text-xl text-teal-900 font-bold mb-4">
              Edit comment
            </h2>

            <form
              onSubmit={handleSubmit(editeComment)}
              className="flex items-center"
            >
              <div className="w-full">
                <input
                  {...register("content")}
                  dir="auto"
                  type="text"
                  placeholder="write your comment"
                  className=" bg-[#fffbf3] w-full text-lg  block  p-2 border-[#a2a2a2]  rounded-2xl "
                />
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

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className=" absolute top-2 right-2 cursor-pointer flex items-center text-red-500 px-4 py-2 rounded"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
