import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { SakeList } from "@/pages/SakeList";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "sakes",
        element: <SakeList />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
