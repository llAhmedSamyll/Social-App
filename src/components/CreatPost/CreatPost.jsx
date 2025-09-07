import React, { useContext } from "react";
import { UserDataContext } from "../Context/UserDataContext";
import { useForm } from "react-hook-form";
import axios from "axios";

// import style from "./CreatPost.module";

export default function CreatPost() {
  let { data } = useContext(UserDataContext);

  let form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });
  let { register, handleSubmit } = form;
  function handelAddPost(value) {
    let myData = new FormData();
    myData.append("body", value.body);
    myData.append("image", value.image[0]);

    axios.post("https://linked-posts.routemisr.com/posts", myData, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    }).then((res) => {
      console.log(res)
    })
    .catch((err)=> {
      console.log(err)
    })
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
                accept="image/*"
              />
            </label>
            <button className="bg-[#111827] text-white px-4 py-1 cursor-pointer  rounded-sm  hover:bg-[#415176] transition">
              Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
