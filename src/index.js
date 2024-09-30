import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Routes,
} from "react-router-dom";

import "./index.scss";
import "macro-css";

import App from "./App";
import Home from "./pages/Home";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <div>404 Not Found</div>,
//     children: [
//       {
//         path: "/home",
//         element: <Home />,
//       },
//     ],
//   },
//   {
//     path: "/test",
//     element: <div>testik</div>,
//   },
// ]);

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
