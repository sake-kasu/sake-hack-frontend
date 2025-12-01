import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
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
