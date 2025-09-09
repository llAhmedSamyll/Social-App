import React, { useState } from "react";
import style from "./LatestPosts.module.css";
import axios from "axios";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import AddComment from "../AddComment/AddComment";
import Upbutton from "../Upbutton/Upbutton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@tanstack/react-query";

export default function LatestPosts() {
  dayjs.extend(relativeTime);

  const [visibleCount, setVisibleCount] = useState(50);
  const [search, setSearch] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["latestPosts"],
    queryFn: async () => {
      let allPosts = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const res = await axios.get(
          `https://linked-posts.routemisr.com/posts?limit=50&page=${page}`,
          { headers: { token: localStorage.getItem("userToken") } }
        );

        allPosts.push(...res.data.posts);

        if (res.data.paginationInfo?.nextPage) {
          page = res.data.paginationInfo.nextPage;
        } else {
          hasNext = false;
        }
      }

      allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return Array.from(
        new Map(allPosts.map((post) => [post._id, post])).values()
      );
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  const filteredPosts = posts.filter((post) =>
    post.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <div className={`${style.LatestPosts} min-h-screen pt-10 px-4`}>
      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by user name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {isLoading && (
        <div className="flex flex-col justify-center mt-32 space-y-4 items-center">
          <span className="text-gray-500 text-4xl">
            <i className="fa-solid fa-spinner fa-spin-pulse"></i>
          </span>
        </div>
      )}

      {!isLoading &&
        visiblePosts.map((post) => (
          <div key={post._id} className="my-4">
            <div className="bg-[#f1eee7] rounded-xl overflow-hidden shadow-md p-2 h-fit container flex flex-col justify-center mx-auto max-w-2xl">
              <Link to={`/postdetails/${post._id}`}>
                <div className="p-4">
                  <div className="flex items-center gap-2.5">
                    <div className="size-12 rounded-full overflow-hidden bg-white flex items-center">
                      <img
                        className="w-full"
                        src={post.user.photo}
                        alt={post.user.name}
                      />
                    </div>
                    <div className="flex flex-wrap flex-col">
                      <h3 className="font-medium text-lg">{post.user.name}</h3>
                      <span
                        dir="ltr"
                        className="text-sm text-left text-teal-600"
                      >
                        {dayjs(post.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="pt-5">
                    <p dir="auto">{post.body}</p>
                  </div>
                </div>
                {post.image && (
                  <div className="flex justify-center overflow-hidden bg-white rounded-xl">
                    <img className="w-full" src={post.image} alt="" />
                  </div>
                )}
                <hr className="border-gray-300 mt-5" />
                <div className="p-2 flex justify-between">
                  <div className="text-blue-700">Show comments</div>
                  <div>{post.comments.length} comments</div>
                </div>
              </Link>
              <AddComment postId={post?._id} />
            </div>
          </div>
        ))}

      {visibleCount < filteredPosts.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 50)}
            className="px-6 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700"
          >
            Load More
          </button>
        </div>
      )}

      <div className="py-20"></div>
      <Upbutton />
    </div>
  );
}
