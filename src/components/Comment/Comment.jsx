import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function Comment({ comments }) {
  // console.log(comments?.commentCreator)
  dayjs.extend(relativeTime);

  return (
    <>
      {comments ? (
        <>
          <div className="mt-2 p-3 flex justify-between   bg-red-100 rounded-b-lg ">
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
            <span dir="ltr" className="text-sm text-left text-teal-600 ps-16  ">
              {dayjs(comments?.createdAt).fromNow()}
            </span>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
