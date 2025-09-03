import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  // ✅ API call
  function getUserDataa() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  let { data: userData } = useQuery({
    queryKey: ["userData2"],
    queryFn: getUserDataa,
    select: (data) => data?.data?.user,
  });

  // ✅ State للتحكم في المينيو
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // ✅ اقفال بالـ Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // ✅ اقفال عند الضغط برّه
  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  const { userToken, setuserToken } = useContext(UserContext);
  const navigator = useNavigate();

  function signOut() {
    localStorage.removeItem("userToken");
    setuserToken(null);
    setMenuOpen(false);
    navigator("/login");
  }

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/logo.png" className="h-10" alt="App Logo" />
            <Link
              to={"/"}
              className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >
              Social App
            </Link>
          </div>

          {/* Right side */}
          <div className="flex gap-4 items-center md:order-2">
            {userToken !== null ? (
              <div className="relative" ref={menuRef}>
                {/* زرار الصورة */}
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded={menuOpen}
                  aria-controls="user-dropdown"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={userData?.photo}
                    alt="user photo"
                  />
                </button>

                {/* المينيو */}
                {menuOpen && (
                  <div
                    id="user-dropdown"
                    role="menu"
                    className="absolute right-0 mt-2 z-50 w-fit min-w-40 origin-top-right text-base bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 dark:text-white">
                        {userData?.name}
                      </span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                        {userData?.email}
                      </span>
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          <i className="fa-solid fa-user  " />
                          <span className="ps-2">Profile</span>
                        </Link>
                      </li>
                      <li>
                        <span
                          onClick={signOut}
                          className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          <i className="fa-solid fa-right-from-bracket fa-flip-horizontal  "></i>
                          <span className="ps-2">SignOut</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <ul className="flex gap-4">
                <Link to="/register">
                  <li className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center">
                    Register
                  </li>
                </Link>

                <Link to="/login">
                  <li className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center ">
                    Login
                  </li>
                </Link>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
