import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression"; // ✅ مكتبة ضغط الصور

export default function UpdatePhoto() {
  const [open, setOpen] = useState(false);
  const [isload, setisload] = useState(false);
  const [file, setFile] = useState(null);

  const form = useForm({
    defaultValues: {
      photo: "",
    },
  });

  let { register, handleSubmit } = form;

  async function handelChangePhoto(value) {
    if (!file) return;

    setisload(true);

    try {
      //  ضغط الصورة قبل الرفع
      const options = {
        maxSizeMB: 1, // أقصى حجم بعد الضغط
        maxWidthOrHeight: 800, // أقصى عرض/طول
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      let myPhoto = new FormData();
      myPhoto.append("photo", compressedFile);

      const res = await axios.put(
        "https://linked-posts.routemisr.com/users/upload-photo",
        myPhoto,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );

      console.log(res);
      toast.success("Changed successfully");
      setOpen(false);
    } catch (err) {
      console.log(err);
      if (
        err.response?.data?.error ===
        `"mimetype" must be one of [image/jpeg, image/png, image/jpg]`
      ) {
        toast.error("Allowed files ( jpg - jpeg - png ) only !! ");
      } else {
        toast.error("Something went wrong, please try again.");
      }
      setOpen(true);
    } finally {
      setisload(false);
    }
  }

  //  check size before upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const maxSize = 4 * 1024 * 1024; // 4 MB

    if (selectedFile.size > maxSize) {
      toast.error("Maximum allowed size is 4 MB !");
      e.target.value = null; // clear input
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  return (
    <>
      <div className="flex justify-center py-2 ">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md hover:bg-[#eee] flex bg-[#FEE2E2] py-1 border-[#b4b4b4] border-dashed border-1 px-4 cursor-pointer text-[#485571]"
        >
          Update picture
        </button>

        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-50 grid h-screen w-screen place-items-center  
        bg-black/60 backdrop-blur-sm transition-opacity duration-300 
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {/* Modal */}
          <div
            className={`bg-[#F1EEE7] rounded-xl shadow-lg max-w-md w-full p-6 transform mt-[-200px] transition-all duration-300
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          >
            <h2 className="text-xl font-bold mb-4">Change profile picture</h2>
            <form onSubmit={handleSubmit(handelChangePhoto)}>
              <div>
                <input
                  {...register("photo")}
                  accept=".jpg, .jpeg, .png"
                  required
                  className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                  onChange={handleFileChange}
                  id="file_input"
                  type="file"
                />
              </div>
              <div className="flex flex-col items-center mt-4 text-teal-800">
                <span>Maximum file size limit ( 4 MB )</span>
                <span>Allowed files ( jpg - jpeg - png ) </span>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  disabled={!file}
                  type="submit"
                  className="bg-[#111827] disabled:hidden cursor-pointer text-white px-4 py-2 rounded"
                >
                  {isload ? (
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                  ) : (
                    "Upload"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-red-600 cursor-pointer flex items-center text-white px-4 py-2 rounded"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
