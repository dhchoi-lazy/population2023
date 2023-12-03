import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Cartogram from "./components/Cartogram";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/cartogram-sbs",
    element: (
      <App>
        <Cartogram bgColor={"black"} />
      </App>
    ),
  },
  {
    path: "cartogram-mbc",
    element: (
      <App>
        <Cartogram bgColor={"white"} />
      </App>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
