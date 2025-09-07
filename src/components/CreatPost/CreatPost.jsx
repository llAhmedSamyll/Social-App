import React, { useContext, useState } from "react";
import { UserDataContext } from "../Context/UserDataContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

export default function CreatPost() {
  let { data } = useContext(UserDataContext);
  const [isload, setisload] = useState(false);

  let form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });
  let { register, handleSubmit } = form;
  async function handelAddPost(value) {
    if (!value.image || value.image.length === 0) {
      toast.error("Please upload an image before posting!");
      return;
    }
    setisload(true);
    let myData = new FormData();
    myData.append("body", value.body);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(value.image[0], options);

    myData.append("image", compressedFile);

    axios
      .post("https://linked-posts.routemisr.com/posts", myData, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        setisload(false);
        toast.success("Posted successfully");
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
      <div className="max-w-2xl mx-auto bg-[#fdfcfa] rounded-2xl shadow-md p-4 mb-6">
        <form onSubmit={handleSubmit(handelAddPost)}>
          <div className="flex gap-3 items-start">
            <img
              src={data?.photo}
              alt="profile"
              className="w-10 h-10 rounded-full "
            />
            <textarea
              {...register("body")}
              placeholder={"What's on your mind, " + data?.name + "?"}
              className="flex-1 resize-none p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
              rows="3"
            />
          </div>

          <div className="flex items-center justify-between mt-3 border-[#D1D5DB] border-t pt-3">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-500">
              <i className="fa-solid fa-image"></i>
              <span className="mt-1">Add Photo</span>
              <input
                {...register("image")}
                type="file"
                className="hidden"
                accept=".jpg, .jpeg, .png"
              />
            </label>
            <button
              disabled={isload}
              type="submit"
              className="bg-[#111827] text-white px-4 py-1 cursor-pointer  disabled:cursor-not-allowed rounded-sm  hover:bg-[#415176] transition"
            >
              {isload ? (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
