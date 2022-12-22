import styled from "@emotion/styled";
import { FC } from "react";
import { ReactComponent as CrossSVG } from "./assets/cross.svg";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 1rem);
  place-content: center;
  font-size: 3rem;
  text-align: center;
`;

const StyledSVG = styled(CrossSVG)`
  background-color: transparent;
  width: 6rem;
  height: 6rem;
`;

export const Error: FC<{ error: unknown }> = ({ error }) => {
  return (
    <Container>
      <StyledSVG />
      {typeof error === "object" &&
      error &&
      "message" in error &&
      typeof error.message === "string" ? (
        <p>error.message</p>
      ) : (
        <p>Qualcosa non va, prova con un refresh</p>
      )}
    </Container>
  );
};
