

import React from "react";
import { RouterProvider } from "react-router-dom";
import Routes from "./Routes/Router.jsx";
import "./App.css";
import { Toaster } from "react-hot-toast";

import SocketListener from "./SocketListener.jsx";

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <SocketListener />

      <RouterProvider router={Routes} />
    </>
  );
};

export default App;
