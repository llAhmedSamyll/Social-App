import React from "react";
import style from "./Profile.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UserPosts from "../userPosts/userPosts";
import dayjs from "dayjs";
import ChangPassModal from "../ChangPassModal/ChangPassModal";
import UpdatePhoto from "../UpdatePhoto/UpdatePhoto";

export default function Profile() {
  function getUserData() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  let { data, isFetching } = useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
    select: (data) => data?.data?.user,
    staleTime: 1000 * 60 * 5, // يفضل يستخدم الكاش 5 دقايق
    cacheTime: 1000 * 60 * 10, // يخلي الكاش عايش 10 دقايق حتى لو مفيش كومبوننت
    refetchOnMount: false, // مش هيعمل refetch أوتوماتيك أول ما ترجع
    refetchOnWindowFocus: false, // مش هيعمل refetch أول ما تركز على التاب
  });
  // console.log(data);
  function formatDate(dateValue) {
    return dayjs(dateValue).format("DD/MM/YYYY");
  }

  return (
    <>
      <div className={`${style.Profile} min-h-screen pt-10 px-4`}>
        {isFetching ? (
          <div
            aria-label="Loading..."
            role="status"
            className="flex  flex-col justify-center my-5 space-y-2 items-center "
          >
            <svg
              className="h-10 w-10 animate-spin stroke-gray-500"
              viewBox="0 0 256 256"
            >
              <line
                x1={128}
                y1={32}
                x2={128}
                y2={64}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={24}
              />
              <line
                x1="195.9"
                y1="60.1"
                x2="173.3"
                y2="82.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={24}
              />
              <line
                x1={224}
                y1={128}
                x2={192}
                y2={128}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={24}
              />
              <line
                x1="195.9"
                y1="195.9"
                x2="173.3"
                y2="173.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={24}
              />
              <line
                x1={128}
                y1={224}
                x2={128}
                y2={192}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={24}
              />
              <line
                x1="60.1"
                y1="195.9"
                x2="82.7"
                y2="173.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={24}
              />
              <line
                x1={32}
                y1={128}
                x2={64}
                y2={128}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={24}
              />
              <line
                x1="60.1"
                y1="60.1"
                x2="82.7"
                y2="82.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={24}
              />
            </svg>
          </div>
        ) : (
          ""
        )}
        <div className="max-w-lg mx-auto bg-[#F1EEE7] shadow-md rounded-2xl overflow-hidden  ">
          <div className=" py-5  bg-gradient-to-b from-[#E2E2E2] to-[#F1EEE7]  ">
            <div className="flex justify-center">
              <img
                src={data?.photo}
                alt="User pic"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
              />
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-slate-800">
                {data?.name}
              </h2>
              <p className="text-slate-500 text-sm">{data?.email}</p>
            </div>
          </div>
          <div className="text-center px-6 pb-3">
            <hr className="border-[#D1D5DB]  " />
            <div className="flex flex-col items-start mt-3 ">
              <p className="font-bold text-sm">
                Joined:
                <span
                  dir="ltr"
                  className="text-slate-500 text-left font-medium ms-2 text-sm mt-1"
                >
                  {formatDate(data?.createdAt)}
                </span>
              </p>

              <p className="font-bold text-sm">
                date of birth :
                <span
                  dir="ltr"
                  className="text-slate-500 text-left font-medium ms-2 text-sm mt-1"
                >
                  {formatDate(data?.dateOfBirth)}
                </span>
              </p>
              <p className="font-bold text-sm">
                Gender :
                <span className="text-slate-500 font-medium ms-2 text-sm mt-1">
                  {data?.gender}
                </span>
              </p>
            </div>
          </div>
        </div>
      <div className=" flex justify-center gap-10 max-w-lg mx-auto bg-[#F1EEE7] shadow-md rounded-lg mt-3 overflow-hidden ">
        <ChangPassModal/>
        <UpdatePhoto/>
      </div>
        <UserPosts id={data?._id} />
      </div>
    </>
  );
}
