import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

// import style from "./ChangPassModal.module";

export default function ChangPassModal() {
  const [open, setOpen] = useState(false);
  const [isload, setisload] = useState(false);

  const schema = z.object({
    password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    newPassword: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "The password must be 8 characters or more and include: an uppercase letter + a lowercase letter + a number + a special symbol."
      ),
  });

  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    resolver: zodResolver(schema),
  });

  let { register, handleSubmit, formState } = form;
  function handelChangePassword(value) {
    setisload(true);
    axios
      .patch(
        "https://linked-posts.routemisr.com/users/change-password",
        value,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      )
      .then((res) => {
        toast.success("done");
        setOpen(false);
        setisload(false);
      })
      .catch((err) => {
        toast.error("The old password is incorrect.");
        setisload(false);
        console.log(err)
      });
  }

  return (
    <>
      <div className="  flex justify-center py-2 ">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md  hover:bg-[#eee] flex  bg-[#FEE2E2] py-1  border-[#b4b4b4] border-dashed  border-1 px-4 cursor-pointer text-[#485571]"
        >
          Change Password
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
            <h2 className="text-xl font-bold mb-4">Change your Password</h2>
            <form onSubmit={handleSubmit(handelChangePassword)}>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter old password"
                className=" bg-[#efefef] w-full p-2 rounded mb-3"
              />
              <input
                {...register("newPassword")}
                type="password"
                placeholder="Enter new password"
                className=" bg-[#efefef] w-full p-2 rounded mb-3"
              />
              <div>
                {formState.errors.newPassword ? (
                  <p className="text-red-500 text-sm  mt-1 ">
                    <i className=" text-yellow-600 mr-2 fa-solid fa-circle-exclamation" />
                    {formState.errors.newPassword.message}
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="flex justify-between mt-4">
                <>
                  <button
                    type="submit"
                    className="bg-[#111827] cursor-pointer text-white px-4 py-2 rounded"
                  >
                    {isload ? (
                      <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                    ) : (
                      "Change"
                    )}
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
