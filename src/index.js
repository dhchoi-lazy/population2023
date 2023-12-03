import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Cartogram from "./components/Cartogram";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/population2023/cartogram-sbs",
      element: (
        <App>
          <Cartogram bgColor={"black"} />
        </App>
      ),
    },
    {
      path: "/population2023/cartogram-mbc",
      element: (
        <App>
          <Cartogram bgColor={"white"} />
        </App>
      ),
    },
  ],
  {
    basename: "/population2023",
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
