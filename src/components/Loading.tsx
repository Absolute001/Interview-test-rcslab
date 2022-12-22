import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { FC } from "react";
import { ReactComponent as LoadingSVG } from "./assets/loading.svg";

const animation = keyframes`
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: calc(100vh - 1rem);
  place-content: center;
  font-size: 3rem;
`;

const StyledSVG = styled(LoadingSVG)`
  background-color: transparent;
  width: 3rem;
  height: 3rem;
  animation: ${animation} infinite 500ms;
  color: white;
`;


export const Loading: FC = () => {
  return (
    <Container data-testid='loading'>
      Loading
      <StyledSVG />
    </Container>
  );
};
