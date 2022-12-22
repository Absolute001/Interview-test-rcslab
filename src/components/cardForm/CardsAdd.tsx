/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardsAddSchema, cardsAddSchema } from "./schema";
import { Button, RedirectButton } from "../Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { useGetCards } from "../../hooks/useGetCards";
import { pipe } from "fp-ts/function";
import * as RD from "@devexperts/remote-data-ts";
import { PageProps } from "../../utils/types";
import * as O from "fp-ts/Option";
import * as RA from "fp-ts/ReadonlyArray";
import { ErrorBox } from "../ErrorBox";
import { css } from "@emotion/react";
import { Loading } from "../Loading";
import { Error } from "../Error";

const StyledInput = styled.input<{ $error?: boolean }>`
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  outline: none;
  border: 1px solid ${({ $error }) => ($error ? "red" : "black")};
`;

const inputMaskStyles = (error?: boolean) => css`
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  outline: none;
  border: 1px solid ${error ? "red" : "black"};
`;

const StyledSelect = styled.select`
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  background-color: #484747;
  border-radius: 0.5rem;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
`;

const Section = styled.section`
  width: 100%;
  @media (min-width: 600px) {
    width: 50%;
    margin: 0 auto;
  }
`;

const addCardData = async (card: CardsAddSchema) =>
  await fetch(`http://localhost:3000/cardsData/`, {
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
    body: JSON.stringify(card),
  })
    .then((_) => _.json)
    .catch((e) => e);

export const CardsAdd: FC = () => {
  const getCards = useGetCards();

  return pipe(
    getCards,
    RD.fold3(
      () => <Loading />,
      (e) => <Error error={e} />,
      (cards) => <CardsAddContent cards={cards} />
    )
  );
};

const CardsAddContent: FC<PageProps> = ({ cards }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationKey: ["create-card"],
    mutationFn: (card: CardsAddSchema) => addCardData(card),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["cardsData"]);
      navigate("/cards");
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CardsAddSchema>({
    resolver: zodResolver(cardsAddSchema),
    defaultValues: {
      cardNumber: "",
      exp: "",
    },
  });

  const submit = (form: CardsAddSchema) =>
    pipe(
      cards,
      RA.findFirst(({ cardNumber }) => cardNumber === form.cardNumber),
      O.match(
        () => mutate(form),
        () =>
          setError("cardNumber", {
            message:
              "Attenzione! Il numero di questa carta é giá presente nel sistema!",
            type: "validate",
          })
      )
    );

  return (
    <Section>
      <h2>Crea una nuova carta</h2>
      <StyledForm onSubmit={handleSubmit(submit)}>
        <StyledLabel>
          Numero carta
          <Controller
            control={control}
            name="cardNumber"
            render={({ field: { ...props } }) => (
              <InputMask
                css={inputMaskStyles(!!errors.exp?.message)}
                mask={"9999-9999-9999-9999"}
                maskPlaceholder="XXXX-XXXX-XXXX-XXXX"
                alwaysShowMask
                {...props}
              />
            )}
          />
        </StyledLabel>
        <StyledLabel>
          Cvv
          <StyledInput
            $error={!!errors.cvv?.message}
            maxLength={3}
            placeholder="123"
            {...register("cvv")}
          />
        </StyledLabel>
        <StyledLabel>
          Scadenza
          <Controller
            control={control}
            name="exp"
            render={({ field: { ...props } }) => (
              <InputMask
                css={inputMaskStyles(!!errors.exp?.message)}
                mask={"99/99/9999"}
                maskPlaceholder="GG/MM/AAAA"
                alwaysShowMask
                {...props}
              />
            )}
          />
        </StyledLabel>

        <StyledLabel>
          Circuito
          <StyledSelect {...register("circuit")}>
            <option>Mastercard</option>
            <option>Visa</option>
          </StyledSelect>
        </StyledLabel>

        {errors.cardNumber?.message &&
          errors.cardNumber.type === "validate" && (
            <ErrorBox message={errors.cardNumber.message} />
          )}
        <Button $loading={isLoading} type="submit">
          {isLoading ? "Creazione" : "Conferma"}
        </Button>
        <RedirectButton type="button" onClick={() => navigate("/cards")}>
          Torna alle tue carte
        </RedirectButton>
      </StyledForm>
    </Section>
  );
};
