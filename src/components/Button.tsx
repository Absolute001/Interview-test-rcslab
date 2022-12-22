import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const loadingAnimation = keyframes`
  0%{
    opacity: 100%;
  }
  50%{
    opacity: 50%;
  }
  100%{
    opacity: 100%;
  }
`;

export const Button = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  outline: none;
  border: 1px solid black;
  background-color: white;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 1.5rem;
  background-color: #4672f4;
  color: white;
  cursor: pointer;
  ${({ $loading }) =>
    $loading &&
    css`
      animation: ${loadingAnimation} infinite 1000ms;
    `}
  :disabled {
    background-color: gray;
    color: black;
    opacity: 75%;
    border: 1px solid black;
    cursor: not-allowed;
  }
`;

export const DeleteCardButton = styled(Button)`
  margin-bottom: 0.5rem;
  background-color: #ff0000d6;
  border: 1px solid #6d0f0f;
`;

export const RedirectButton = styled(Button)`
  background-color: white;
  color: black;
`;

export const PaginationButton = styled(RedirectButton)`
  padding: 0.5rem;
  margin-bottom: 0;
`;
