import React, { useContext, useState } from "react";
import { UserDataContext } from "../Context/UserDataContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

export default function CreatPost() {
  let { data } = useContext(UserDataContext);
  const [isload, setisload] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); 
      setPreview(URL.createObjectURL(file));
    }
  };

  let form = useForm({
    defaultValues: {
      body: "",
    },
  });

  let { register, handleSubmit, reset } = form;

  async function handelAddPost(value) {
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
      .post("https://linked-posts.routemisr.com/posts", myData, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        setisload(false);
        toast.success("Posted successfully");
        reset(); 
        setSelectedFile(null); 
        setPreview(null); 
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
      <div className="max-w-2xl mx-auto bg-[#F1EEE7] rounded-lg shadow-md p-4 mb-6">
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
          <div>
            {preview && (
              <div className="flex justify-center items-center overflow-hidden my-8 bg-white rounded-xl ">
                <img className="max-w-full" src={preview} alt="" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 border-[#D1D5DB] border-t pt-3">
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
          </div>
        </form>
      </div>
    </>
  );
}
