import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import fetchMock from "jest-fetch-mock";

const queryClient = new QueryClient();

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

test("renders without errors", async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify([
      {
        cardNumber: "3538-9020-4943-556",
        circuit: "Visa",
        exp: "23/11/2022",
        cvv: 180,
        id: 2,
      },
    ])
  );
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  const text = await screen.findByText("Le mie carte");
  expect(text).toBeInTheDocument();
});

test("should render 0 cards if not valid cards is sent by BE", async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify([
      {
        cardNumber: "3538-9020-4943-556",
        circuit: "American Express",
        exp: "23/11/2022",
        cvv: 180,
        id: 2,
      },
    ])
  );
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  const text = await screen.findByText("Le mie carte");
  expect(text).toBeInTheDocument();


  expect(screen.queryAllByText('3538-9020-4943-556').length).toBe(0)
});
