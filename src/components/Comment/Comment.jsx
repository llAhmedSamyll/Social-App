import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import UpdateComment from "../UpdateComment/UpdateComment";
import DeleteComment from "../DeleteComment/DeleteComment";

export default function Comment({ comments }) {
  const [humburger, sethumburger] = useState(false)

  
  console.log(comments)
  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s",
      s: "now",
      m: "1m",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
      d: "1d",
      dd: "%dd",
      M: "1mo",
      MM: "%dmo",
      y: "1y",
      yy: "%dy",
    },
  });
  return (
    <>
      {comments ? (
        <>
          <div className="mt-2 p-3 flex justify-between   bg-[#e8e8e8] rounded-b-lg ">
            <div className="flex gap-x-5">
              <div className="size-8 flex justify-center items-center bg-[#eee] rounded-full overflow-hidden  ">
                <img className="" src="/user.png" />
              </div>
              <div className="bg-[#eee] px-3 py-2 rounded-2xl">
                <h2 className=" font-medium text-blue-900 ">
                  {comments?.commentCreator?.name}
                </h2>
                <p className="text-teal-700">{comments?.content}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <span dir="ltr" className="text-sm text-left flex justify-center text-teal-600   ">
                {dayjs(comments?.createdAt).fromNow()}
              </span>
              <span className="text-lg text-left relative  ">
                <button className="cursor-pointer" onClick={() => sethumburger(!humburger)}>
                  <i className="fa-solid fa-bars  text-blue-600  "></i>
                </button>
                {humburger &&  <span className="absolute top-[-25px] right-8 overflow-hidden  bg-white border rounded-lg border-teal-400 ">
                  <UpdateComment id={comments?._id}/>
                  <hr className="border-teal-700" />
                  <DeleteComment id={comments?._id} />
                </span> }
              </span>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
