import { flow, pipe } from "fp-ts/function";
import * as S from "fp-ts/string";
import { NonEmptyString, date } from "io-ts-types";
import * as O from "fp-ts/Option";
import { Cards } from "../codecs/cards";
import * as iots from "io-ts";
import {
  isLuhnValid,
  cardNumberToArray,
  expirationDate,
  isValidCircuit,
} from "./functions";

export const validatedCard = iots.readonly(
  iots.type({
    circuit: iots.union([iots.literal("Mastercard"), iots.literal("Visa")]),
    cardNumber: NonEmptyString,
    cvv: iots.number,
    exp: date,
    id: iots.number,
  })
);

export type ValidatedCard = iots.TypeOf<typeof validatedCard>;

export const validateCard = (card: Cards[number]): O.Option<ValidatedCard> => {
  return pipe(
    card,
    O.fromNullable,
    O.bindTo("card"),
    O.bind("isLuhnValid", ({ card: { cardNumber } }) =>
      isLuhnValid(cardNumber)
    ),
    O.bind("has16Digits", ({ card: { cardNumber } }) =>
      pipe(
        cardNumber,
        cardNumberToArray,
        O.map(flow(O.fromPredicate((allDigits) => allDigits.length === 16)))
      )
    ),
    O.bind("cvvHas3Digit", ({ card: { cvv } }) =>
      pipe(
        cvv.toString(),
        S.split(""),
        O.fromPredicate((card) => card.length === 3)
      )
    ),
    O.bind("notExpiredDate", ({ card: { exp } }) => expirationDate(exp)),
    O.bind("validCircuit", ({ card: { circuit } }) =>
      O.fromPredicate(isValidCircuit)(circuit)
    ),
    O.map(({ validCircuit, notExpiredDate, card }) => ({
      circuit: validCircuit,
      cardNumber: card.cardNumber,
      cvv: card.cvv,
      exp: notExpiredDate,
      id: card.id,
    }))
  );
};
