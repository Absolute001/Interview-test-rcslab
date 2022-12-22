/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { CardsAdd } from "../components/cardForm/CardsAdd";
import { Cards } from "../components/cardList/Cards";

const Page = styled.section`
  padding: 0.5rem;
  background-color: #212121;
  min-height: 100vh;
  color: #f8f8f8;
  box-sizing: border-box;
`;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/cards" />,
  },
  {
    path: "cards",
    element: (
      <Page>
        <Cards />
      </Page>
    ),
  },
  {
    path: "cards/add",
    element: (
      <Page>
        <CardsAdd />
      </Page>
    ),
  },
  { path: "*", element: <Navigate to="/cards" /> },
]);
