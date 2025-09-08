import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Register from "./components/Register/Register";
import Notfound from "./components/Notfound/Notfound";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import UserContextProvider from "./components/Context/UserContext";
import ProtectedRout from "./components/ProtectedRout/ProtectedRout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./components/PostDetails/PostDetails";
import toast, { Toaster } from "react-hot-toast";
import UserDataContextProvider from "./components/Context/UserDataContext";
import LatestPosts from "./components/LatestPosts/LatestPosts";
function App() {
  const query = new QueryClient();

  const x = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRout>
              <Home />
            </ProtectedRout>
          ),
        },
        { path: "login", element: <Login /> },
        {
          path: "profile",
          element: (
            <ProtectedRout>
              <Profile />
            </ProtectedRout>
          ),
        },
        {
          path: "postdetails/:id",
          element: (
            <ProtectedRout>
              <PostDetails />
            </ProtectedRout>
          ),
        },
        {
          path: "latestposts",
          element: (
            <ProtectedRout>
              <LatestPosts />
            </ProtectedRout>
          ),
    
        },
        { path: "register", element: <Register /> },
        { path: "*", element: <Notfound /> },
      ],
    },
  ]);
  return (
    <>
      <UserContextProvider>
        <QueryClientProvider client={query}>
          <UserDataContextProvider>
            <RouterProvider router={x}></RouterProvider>
          </UserDataContextProvider>
          <Toaster />
        </QueryClientProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
