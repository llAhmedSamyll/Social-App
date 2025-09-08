import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdatePost({ data }) {
  console.log(data);
  const [isload, setisload] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  let queryClient = useQueryClient();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  let form = useForm({
    defaultValues: {
      body: `${data?.body}`,
    },
  });

  let { register, handleSubmit, reset } = form;

  async function handelUpdatePost(value) {
    setisload(true);
    let myData = new FormData();
    myData.append("body", value.body);

    if (!selectedFile) {
      toast.error("Please upload an image before posting!");
      setisload(false);
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(selectedFile.type)) {
      toast.error("Allowed files ( jpg - jpeg - png ) only !!");
      setisload(false);
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(selectedFile, options);
    myData.append("image", compressedFile);

    if (!value.body || value.body.length === 0) {
      toast.error("Please write the post !");
      setisload(false);
      return;
    }

    axios
      .put(`https://linked-posts.routemisr.com/posts/${data.id}`, myData, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        setisload(false);
        toast.success("Posted successfully");
        queryClient.invalidateQueries({ queryKey: ["userPosts"] });
        reset();
        setSelectedFile(null);
        setPreview(null);
        setOpen(false);
      })
      .catch((err) => {
        setisload(false);
        if (
          err.response?.data?.error ===
          `"mimetype" must be one of [image/jpeg, image/png, image/jpg]`
        ) {
          toast.error("Allowed files ( jpg - jpeg - png ) only !! ");
        } else {
          toast.error("Something went wrong, please try again.");
        }
      });
  }
  return (
    <>
      <div className="  flex justify-center py-2 ">
        <div className="absolute top-0 right-10 text-lg text-amber-900  hover:text-amber-600   ">
          <button onClick={() => setOpen(true)}>
            <i className="fa-solid fa-pen-to-square cursor-pointer"></i>
          </button>
        </div>

        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-50 grid h-screen w-screen place-items-center  
        bg-black/60 backdrop-blur-sm transition-opacity duration-300 
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Modal */}
          <div
            className={`bg-[#F1EEE7] rounded-xl shadow-lg max-w-[800px] container p-6 transform transition-all duration-300
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          >
            <h2 className="text-xl font-bold mb-4">Update post</h2>
            <form onSubmit={handleSubmit(handelUpdatePost)}>
              <div className="flex gap-3 my-5 items-start">
                <textarea
                  dir="auto"
                  {...register("body")}
                  placeholder="What's on your mind "
                  className="flex-1 resize-none p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  rows="3"
                />
              </div>
              <div>
                {preview && (
                  <div className="flex justify-center max-h-72 overflow-hidden bg-white rounded-xl">
                    <img className="object-contain" src={preview} alt="" />
                  </div>
                )}
              </div>

              <div className="flex items-center  justify-between mt-3 border-[#D1D5DB] border-t pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-500">
                  <i className="fa-solid fa-image"></i>
                  <span className="mt-1">Add Photo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                  />
                </label>

                <button
                  disabled={isload}
                  type="submit"
                  className="bg-[#111827] text-white px-4 py-1 cursor-pointer disabled:cursor-not-allowed rounded-sm hover:bg-[#415176] transition"
                >
                  {isload ? (
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                  ) : (
                    "Post"
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
