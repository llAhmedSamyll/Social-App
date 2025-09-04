import React, { useEffect, useState } from "react";

export default function Upbutton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // الفنكشن اللي بتخلي الصفحة ترجع لفوق
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6  right-6 p-3 rounded-lg bg-[#111827] text-white shadow-lg hover:bg-gray-700 transition-all"
        >
          <i className="fa-solid fa-arrow-up fa-bounce"></i>
        </button>
      )}
    </>
  );
}
