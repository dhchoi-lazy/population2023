import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Cartogram from "./components/Cartogram";
import { BrowserRouter } from "react-router-dom";

// import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <App>
//         <Cartogram bgColor={"black"} />
//         <Outlet />
//       </App>
//     ),
//     children: [
//       {
//         path: "/cartogram-sbs",
//         element: (
//           <App>
//             <Cartogram bgColor={"black"} />
//           </App>
//         ),
//       },
//       {
//         path: "/cartogram-mbc",
//         element: (
//           <App>
//             <Cartogram bgColor={"white"} />
//           </App>
//         ),
//       },
//     ],
//   },
//   {
//     basename: "/population2023",
//   },
// ]);

const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<RouterProvider router={router} />);
root.render(
  <BrowserRouter basename="/population2023">
    <Link to="/cartogram-sbs">Cartogram SBS</Link>
    <Link to="/cartogram-sbs">Cartogram SBS</Link>
  </BrowserRouter>
);
