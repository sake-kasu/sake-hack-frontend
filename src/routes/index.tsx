import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { RootLayout } from "@/components/layouts/RootLayout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
