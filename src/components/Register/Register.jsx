import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import style from "./Register.module.css";

export default function Register() {
  const navigator = useNavigate();
  const [apiErr, setapiErr] = useState("");
  const [isLoading, setisLoading] = useState(false);

  //  هنا بنعمل الفاليديشن بمكتبة زود
  const schema = z
    .object({
      name: z.string().min(3, "Invalid name"),
      email: z.email("Invalid email"),
      password: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "The password must be 8 characters or more and include: an uppercase letter + a lowercase letter + a number + a special symbol."
        ),
      rePassword: z.string(),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter your date of birth")
        .refine((date) => {
          const userDate = new Date(date);
          const nowDate = new Date();
          nowDate.getHours(0, 0, 0, 0);
          return userDate < nowDate;
        }, "Your date of birth can't be from the future!!"),
      gender: z.enum(
        ["male", "female"],
        "Gender must be one of (male - female)"
      ),
    })
    .refine((object) => object.password === object.rePassword, {
      error: "Password and repassword is not matched !!",
      path: ["rePassword"],
    });

  //  المكتبة دي بتسحب الفاليو من الانبوت بمجرد الكتابه فيها وبتحزنها
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema), // االسطر دا مهم ووظيفته بيربط بين الاسكيما والريجكس المطلوب بالفورم بقول لل(يوز فورم) اني هعمل فاليديشن بمكتبة (زود ريسولفر) وهيستخدم الاسكيما من المتغير اسمه اسكيما
  });

  let { register, handleSubmit, formState } = form;

  function submit(data) {
    setisLoading(true);
    axios
      .post("https://linked-posts.routemisr.com/users/signup", data)
      .then((res) => {
        if (res.data.message === "success") {
          navigator("/login");
          setisLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.response.data.error);
        setapiErr(err.response.data.error);
        setisLoading(false);
      });
  }

  return (
    <>
      <div className={`${style.Register} px-2 h-screen`}>
        {apiErr === "" ? null : (
          <div
            className="flex items-center py-1 px-4 translate-y-7 w-fit  text-yellow-400 rounded-lg bg-[#111827] animate-pulse"
            role="alert"
          >
            <svg
              className="shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div className="ms-3 pr-4 text-sm font-medium">
              This email is already in use.
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(submit)} //   هنا بقوله لما ادوس زرار السبمت بينادي دالة هاندل سبمت واللي بدورها بتمنع الريلود وتحقق من الفاليديشن  لو تمام بتنفذ اللي جواها واللي هو فانكشن ارسال الداتا لل أ بي أي وتبعتله الداتا
          className="max-w-lg px-5 translate-y-20 container p-5 rounded-2xl border-1 border-gray-400 shadow-lg  mx-auto "
        >
          <h1
            className="text-3xl font-extrabold text-stone-700 text-center pb-6 tracking-tight 
                bg-clip-text  
               "
          >
            Create a new account
          </h1>
          <div className="mb-4">
            <div className="flex ">
              <span className="inline-flex items-center px-3 text-lg text-gray-700 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                <i className="fa-solid fa-user" />
              </span>
              <input
                type="text"
                {...register("name")}
                className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-lg p-2.5 "
                placeholder="Enter your name"
              />
            </div>
            <div>
              {formState.errors.name ? (
                <p className="text-red-500 text-sm  mt-1 ml-12 ">
                  <i className=" text-yellow-600 mr-2 fa-solid fa-circle-exclamation" />
                  {formState.errors.name.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex  ">
              <span className="inline-flex items-center px-3 text-lg text-gray-700 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="text"
                {...register("email")}
                className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-lg p-2.5 "
                placeholder="Enter your email"
              />
            </div>
            <div>
              {formState.errors.email ? (
                <p className="text-red-500 text-sm  mt-1 ml-12 ">
                  <i className=" text-yellow-600 mr-2 fa-solid fa-circle-exclamation" />
                  {formState.errors.email.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex ">
              <span className="inline-flex items-center px-3 text-lg text-gray-700 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                <i className="fa-solid fa-key"></i>
              </span>
              <input
                type="password"
                {...register("password")}
                className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-lg p-2.5 "
                placeholder="Enter your password"
              />
            </div>
            <div>
              {formState.errors.password ? (
                <p className="text-red-500 text-sm  mt-1 ml-12 ">
                  <i className=" text-yellow-600 mr-2 fa-solid fa-circle-exclamation" />
                  {formState.errors.password.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex mb-4 ">
              <span className="inline-flex items-center px-3 text-lg text-gray-700 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                <i className="fa-solid fa-key"></i>
              </span>
              <input
                type="password"
                {...register("rePassword")}
                className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-lg p-2.5 "
                placeholder="Enter your password again"
              />
            </div>
            <div>
              {formState.errors.rePassword ? (
                <p className="text-red-500 text-sm mt-1 ml-12 ">
                  <i className=" text-yellow-600 mr-2 fa-solid fa-circle-exclamation" />
                  {formState.errors.rePassword.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex ">
              <span className="inline-flex items-center px-3 text-lg text-gray-700 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                <i className="fa-solid fa-calendar-days"></i>
              </span>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-lg p-2.5 "
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div>
              {formState.errors.dateOfBirth ? (
                <p className="text-red-500 text-sm  mt-1 ml-12 ">
                  <i className=" text-yellow-600 mr-2 fa-solid fa-circle-exclamation" />
                  {formState.errors.dateOfBirth.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex gap-10 justify-center">
              <div className="flex items-center mb-4 bg-[#eee] p-2 rounded-2xl">
                <input
                  id="male"
                  type="radio"
                  value="male"
                  {...register("gender")}
                  className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600"
                />
                <label
                  htmlFor="male"
                  className="block ms-2  text-sm font-medium"
                >
                  Male
                </label>
              </div>
              <div className="flex items-center mb-4 bg-[#eee] p-2 rounded-2xl">
                <input
                  id="female"
                  type="radio"
                  value="female"
                  {...register("gender")}
                  className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600"
                />
                <label
                  htmlFor="female"
                  className="block ms-2  text-sm font-medium"
                >
                  Female
                </label>
              </div>
            </div>
            <div>
              {formState.errors.gender ? (
                <p className="text-red-500 text-center text-sm   ">
                  <i className=" text-yellow-600 mr-2 fa-solid fa-circle-exclamation" />
                  {formState.errors.gender.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              disabled={isLoading}
              type="submit"
              className="text-white  px-10   bg-gray-900 hover:bg-gray-800   focus:outline-none cursor-pointer font-medium rounded-lg text-l  py-2.5 text-center me-2 mb-2"
            >
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin-pulse" />
              ) : (
                "Register"
              )}
            </button>
          </div>
          <div className="flex justify-center">
            <Link className="text-teal-800" to="/login">
              If you already have an account,{" "}
              <span className="text-blue-600">login now.</span>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
