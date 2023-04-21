import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./components/app";
import "./index.css";
import { HomeUnauthenticated } from "./components/home-unauthenticated";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeUnauthenticated />,
  },
  {
    path: "/home",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
