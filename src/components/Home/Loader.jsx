import React from "react";
import Skeleton from "@mui/material/Skeleton";

export default function PostSkeleton() {
  return (
    <div className="my-4">
      <div className="bg-[#f1eee7] rounded-xl overflow-hidden shadow-md p-2 h-fit container flex flex-col justify-center mx-auto max-w-2xl">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <Skeleton variant="circular" width={48} height={48} />

            <div className="flex flex-col">
              <Skeleton height={14} width={120} className="mb-2" />
              <Skeleton height={12} width={80} />
            </div>
          </div>

          {/* Body */}
          <div className="pt-5">
            <Skeleton height={12} className="mb-2" />
            <Skeleton height={12} width="90%" className="mb-2" />
            <Skeleton height={12} width="70%" />
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center overflow-hidden bg-white rounded-xl">
          <Skeleton variant="rectangular" width="100%" height={250} />
        </div>

        <hr className="border-gray-300 mt-5" />

        {/* Footer */}
        <div className="p-2 flex justify-between">
          <Skeleton height={14} width={100} />
          <Skeleton height={14} width={60} />
        </div>

        {/* Comment Skeleton */}
        <div className="mt-2 p-3 flex justify-between bg-[#e8e8e8] rounded-b-lg">
          <div className="flex gap-x-5">
            {/* Avatar */}
            <Skeleton variant="circular" width={32} height={32} />

            {/* Name + Content */}
            <div className="flex flex-col">
              <Skeleton height={12} width={100} className="mb-2" />
              <Skeleton height={12} width={180} />
            </div>
          </div>

          {/* Time */}
          <div className="flex flex-col justify-between items-end">
            <Skeleton height={10} width={50} />
          </div>
        </div>
      </div>
    </div>
  );
}
