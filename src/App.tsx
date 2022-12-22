import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const queryClient = new QueryClient();

export const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
