/** @jsxImportSource @emotion/react */
import { FC, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "@emotion/styled";
import { pipe } from "fp-ts/function";
import * as RD from "@devexperts/remote-data-ts";
import * as RA from "fp-ts/ReadonlyArray";
import { PageProps } from "../../utils/types";
import { Card } from "../Card";

import { useNavigate } from "react-router-dom";
import { Button, DeleteCardButton } from "../Button";
import { useGetCards } from "../../hooks/useGetCards";
import { Paginator } from "../Paginator";
import { Loading } from "../Loading";
import { Error } from "../Error";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (min-width: 600px) {
    width: 80%;
    margin: 0 auto;
  }
  @media (min-width: 1339px) {
    width: 50%;
    margin: 0 auto;
  }
`;

const CardContainer = styled.div`
  width: 100%;
  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    row-gap: 1.5rem;
    margin: 0 auto;
  }
`;

const deleteCardData = async (id: number) =>
  await fetch(`http://localhost:3000/cardsData/${id}`, {
    method: "DELETE",
  })
    .then((_) => _.json)
    .catch((e) => e);

export const Cards: FC = () => {
  const requestCards = useGetCards();

  return pipe(
    requestCards,
    RD.fold3(
      () => <Loading />,
      (e) => <Error error={e} />,
      (cards) => <CardsContent cards={cards} />
    )
  );
};

const CardsContent: FC<PageProps> = ({ cards }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const {
    mutate,
    isLoading: deletingCard,
    variables,
  } = useMutation({
    mutationKey: ["delete-card"],
    mutationFn: (id: number) => deleteCardData(id),
    onSuccess: async () => await queryClient.invalidateQueries(["cardsData"]),
  });

  return (
    <Container>
      <h2>Le mie carte</h2>
      <h3>Hai in totale: {RA.size(cards)} carte di credito</h3>
      <Button onClick={() => navigate("/cards/add")}>Aggiungi una carta</Button>
      <CardContainer>
        {pipe(
          cards,
          RA.dropLeft((page - 1) * 20),
          RA.takeLeft(20),
          RA.map(({ cardNumber, circuit, exp, id }) => (
            <div key={id}>
              <DeleteCardButton
                disabled={!!deletingCard && variables === id}
                onClick={() => !deletingCard && mutate(id)}
              >
                {deletingCard && variables === id
                  ? "Elimino..."
                  : "Elimina questa carta"}
              </DeleteCardButton>
              <Card cardNumber={cardNumber} circuit={circuit} exp={exp} />
            </div>
          ))
        )}
      </CardContainer>
      <Paginator
        disablePrev={page === 1}
        disableNext={cards.length - page * 20 <= 0}
        currentPage={page}
        totalSize={Math.ceil(cards.length / 20)}
        next={() => {
          setPage((prev) => prev + 1);
          window.scrollTo(0, 0);
        }}
        previous={() => {
          setPage((prev) => prev - 1);
          window.scrollTo(0, 0);
        }}
      />
    </Container>
  );
};
