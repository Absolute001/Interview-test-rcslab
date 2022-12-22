import { flow, pipe } from "fp-ts/function";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as S from "fp-ts/string";
import { NonEmptyString, NumberFromString } from "io-ts-types";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { Cards } from "../codecs/cards";
import { isAfter, isValid, parse } from "date-fns";

export const today: Date = parse("01/12/2022", "do/Lo/yyyy", new Date());
export const parseDate = (date: NonEmptyString): Date =>
  parse(date, "do/Lo/yyyy", today);

export const expirationDate = (exp: Cards[number]["exp"]): O.Option<Date> =>
  pipe(
    exp,
    parseDate,
    O.fromPredicate((date) => isValid(date) && isAfter(date, today))
  );

export const isValidCircuit = (
  circuit: Cards[number]["circuit"]
): circuit is "Mastercard" | "Visa" =>
  circuit === "Mastercard" || circuit === "Visa";

export const cardNumberToArray = (
  cardNumber: NonEmptyString
): O.Option<RNEA.ReadonlyNonEmptyArray<number>> =>
  pipe(
    cardNumber,
    S.split(""),
    RNEA.filter((char) => E.isRight(NumberFromString.decode(char))),
    O.map(flow(RNEA.map((char) => parseInt(char))))
  );

export const has16Digits = pipe((cardNumber: NonEmptyString) =>
  pipe(
    cardNumber,
    cardNumberToArray,
    O.map(O.fromPredicate((cardNumber) => cardNumber.length === 16))
  )
);

export const isLuhnValid = (cardNumber: NonEmptyString): O.Option<number> =>
  pipe(
    cardNumber,
    cardNumberToArray,
    O.matchW(
      () => O.none,
      flow(
        RNEA.reverse,
        RNEA.mapWithIndex((index, digit) =>
          index % 2 === 1 ? digit * 2 : digit
        ),
        RNEA.map((digit) => (digit > 9 ? digit - 9 : digit)),
        RNEA.reduce(0, (acc, current) => acc + current),
        O.fromPredicate((sum) => sum % 10 === 0)
      )
    )
  );
