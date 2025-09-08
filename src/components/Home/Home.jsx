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

export default function Home() {
  dayjs.extend(relativeTime);

  // ✅ جلب البوستات بالترتيب من الأحدث للأقدم
  async function getAllPosts({ pageParam = 1 }) {
    const res = await axios.get(
      `https://linked-posts.routemisr.com/posts?limit=50&page=${pageParam}&sort=desc`,
      {
        headers: { token: localStorage.getItem("userToken") },
      }
    );
    return res.data;
  }

  // ✅ useInfiniteQuery بدال useQuery
  const {
    data,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,
    getNextPageParam: (lastPage) => {
      if (lastPage?.paginationInfo?.nextPage) {
        return lastPage.paginationInfo.nextPage;
      }
      return undefined;
    },
  });

  // ✅ نجمع كل البوستات من الصفحات
  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  // ✅ نتأكد من عدم تكرار نفس البوستات
  const uniquePosts = Array.from(
    new Map(allPosts.map((post) => [post._id, post])).values()
  );

  return (
    <>
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

        {isLoading && !isFetchingNextPage ? (
          <div
            aria-label="Loading..."
            role="status"
            className="flex flex-col justify-center mt-32 space-y-4 items-center space-x-2"
          >
            <svg
              className="h-15 w-15 animate-spin stroke-gray-500"
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
            <span className="text-gray-500 text-lg font-medium">
              Loading...
            </span>
          </div>
        ) : null}

        {/* ✅ عرض البوستات */}
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

                  <Comment comments={post.comments?.[0]} />
                </Link>
                <AddComment postId={post?._id} />
              </div>
            </div>
          </div>
        ))}

        {/* ✅ زرار عرض المزيد */}
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
