import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteComment({ id }) {
  const [isload, setisload] = useState(false);
  const [open, setOpen] = useState(false);
  let queryClient = useQueryClient();
  function deleteComment() {

    setisload(true);
    axios
      .delete(`https://linked-posts.routemisr.com/comments/${id}`, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        setisload(false);
        toast.success("Deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["getcomments"] });
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setisload(false);
        setOpen(false);

        toast.error(" apiمش هيتمسح دي مشكلة من الـ ");
      });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="  hover:bg-[#cfcfcf] px-4 p-1 cursor-pointer text-[#485571]"
      >
        delete
      </button>
      <div
        className={`fixed inset-0 z-50 grid h-screen w-screen place-items-center  
        bg-black/60 backdrop-blur-sm transition-opacity duration-300 
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className={`bg-[#F1EEE7] rounded-xl shadow-lg max-w-xs container p-6 transform transition-all duration-300
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
        >
          <h2 className="text-xl font-bold mb-4">Delete comment ! </h2>

          <div className="flex items-center  justify-center mt-3 pt-3">
            <button
              onClick={deleteComment}
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
    </>
  );
}
