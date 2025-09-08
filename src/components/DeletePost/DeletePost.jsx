import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function DeletePost({ id }) {
  const [isload, setisload] = useState(false);
  const [open, setOpen] = useState(false);
  let queryClient = useQueryClient();
  function deletePost() {
    setisload(true)
    axios
      .delete(`https://linked-posts.routemisr.com/posts/${id}`, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        setisload(false);
        toast.success("Deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["userPosts"] });
        setOpen(false);
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setisload(false);
        toast.error();
      });
  }

  return (
    <>
      <div className="flex justify-center py-2 ">
        <div className="absolute top-0 right-0 text-lg text-amber-900  hover:text-amber-600   ">
          <button onClick={() => setOpen(true)}>
            <i className="fa-solid fa-xmark cursor-pointer "></i>
          </button>
        </div>

        <div
          className={`fixed inset-0 z-50 grid h-screen w-screen place-items-center  
        bg-black/60 backdrop-blur-sm transition-opacity duration-300 
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div
            className={`bg-[#F1EEE7] rounded-xl shadow-lg max-w-xs container p-6 transform transition-all duration-300
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          >
            <h2 className="text-xl font-bold mb-4">Delete post ! </h2>

            <div className="flex items-center  justify-center mt-3 pt-3">
              <button
                onClick={deletePost}
                disabled={isload}
                type="submit"
                className="bg-[#111827] text-white px-4 py-1  cursor-pointer disabled:cursor-not-allowed rounded-sm hover:bg-[#415176] transition"
              >
                {isload ? (
                  <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                ) : (
                  "Delete"
                )}
              </button>
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
