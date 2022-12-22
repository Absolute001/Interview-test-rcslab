import styled from "@emotion/styled";
import { FC } from "react";
import { PaginationButton } from "./Button";

type Props = {
  previous: () => void;
  next: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  currentPage: number;
  totalSize: number;
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 15% 70% 15%;
  margin-bottom: 1.5rem;
`;

const ContainerCounter = styled.div`
  place-self: center;
`;

export const Paginator: FC<Props> = ({
  next,
  previous,
  disableNext,
  disablePrev,
  currentPage,
  totalSize,
}) => {
  return (
    <Container>
      <PaginationButton disabled={disablePrev} onClick={previous}>
        ⇦
      </PaginationButton>
      <ContainerCounter>
        {currentPage} di {totalSize}
      </ContainerCounter>
      <PaginationButton disabled={disableNext} onClick={next}>
        ⇨
      </PaginationButton>
    </Container>
  );
};
