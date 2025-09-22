import { useInfiniteQuery } from "@tanstack/react-query";
import style from "./Home.module.css";
import axios from "axios";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import AddComment from "../AddComment/AddComment";
import Upbutton from "../Upbutton/Upbutton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CreatPost from "../CreatPost/CreatPost";
import LatestPosts from "../LatestPosts/LatestPosts";
import { Helmet } from "react-helmet";
import Facebook from "./Loader";
import SkeletonCard from "./Loader";

export default function Home() {
  dayjs.extend(relativeTime);

  async function getAllPosts({ pageParam = 1 }) {
    const res = await axios.get(
      `https://linked-posts.routemisr.com/posts?limit=50&page=${pageParam}&sort=desc`,
      {
        headers: { token: localStorage.getItem("userToken") },
      }
    );
    return res.data;
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["getPosts"],
      queryFn: getAllPosts,
      getNextPageParam: (lastPage) => {
        if (lastPage?.paginationInfo?.nextPage) {
          return lastPage.paginationInfo.nextPage;
        }
        return undefined;
      },
    });

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  const uniquePosts = Array.from(
    new Map(allPosts.map((post) => [post._id, post])).values()
  );

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className={`${style.Home} min-h-screen pt-10 px-4 `}>
        <CreatPost />
        <div className="flex justify-center">
          <Link
            to={"latestposts"}
            className="rounded-md   hover:bg-[#eee]  bg-[#FEE2E2] p-2  border-[#b4b4b4] border-solid  border-1 px-4 cursor-pointer text-[#485571]"
          >
            <i className="fa-solid fa-newspaper"></i> Latest posts
          </Link>
        </div>

        {isLoading && !isFetchingNextPage ? <SkeletonCard /> : null}

        {uniquePosts.map((post) => (
          <div key={post._id}>
            <div className="my-4">
              <div className="bg-[#f1eee7] rounded-xl overflow-hidden shadow-md p-2 h-fit container flex flex-col justify-center mx-auto max-w-2xl">
                <Link to={`./postdetails/${post._id}`}>
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
                        <h3 className="font-medium text-lg">
                          {post.user.name}
                        </h3>
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
                    <div className="text-teal-800">
                      {post.comments.length} comments
                    </div>
                  </div>
                </Link>
                <AddComment postId={post?._id} />
              </div>
            </div>
          </div>
        ))}

        {hasNextPage && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2 bg-[#111827] text-white rounded-lg "
            >
              {isFetchingNextPage ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                "Load more"
              )}
            </button>
          </div>
        )}

        <div className="py-20"></div>
        <Upbutton />
      </div>
    </>
  );
}
