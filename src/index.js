import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Cartogram from "./components/Cartogram";
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";

const router = createHashRouter([
  {
    element: (
      <App>
        <Outlet />
      </App>
    ),
    children: [
      {
        path: "/cartogram-sbs",
        element: <Cartogram bgColor={"black"} />,
      },
      {
        path: "/cartogram-mbc",
        element: <Cartogram bgColor={"white"} />,
      },
    ],
  },
  {
    basename: "/population2023",
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
