import styled from "@emotion/styled";
import React, { FC } from "react";

const Container = styled.div`
  background-color: #d47c7c;
  color: black;
  border: 2px solid #db3232;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
`;

export const ErrorBox: FC<{ message: string }> = ({ message }) => {
  return <Container>{message}</Container>;
};
